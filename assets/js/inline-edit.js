---
# Development-only asset: the body is emitted only when
# JEKYLL_ENV=development, so production ships an empty file.
---
{%- if jekyll.environment == "development" -%}
/*
 * In-page markdown editing (development only).
 *
 * Loaded only when JEKYLL_ENV=development, so it never reaches GitHub Pages.
 *
 * Clicking a block in a project dialog swaps it for a textarea holding that
 * block's ORIGINAL MARKDOWN, taken from the JSON that _includes/project-body.html
 * emits alongside the rendered HTML. Saving POSTs the block back to
 * scripts/edit_server.py, which rewrites just that block in the .md file.
 *
 * Editing the markdown source rather than the rendered HTML is the whole point:
 * these pages contain MathJax and markdown links, and converting rendered HTML
 * back to markdown would mangle both.
 */
(function () {
    'use strict';

    var SERVER = 'http://127.0.0.1:' + (window.INLINE_EDIT_PORT || 4011);
    var RELOAD_DELAY = 1400;  // give Jekyll time to regenerate before reloading
    var RESTORE_KEY = 'inlineEdit.restore';
    var enabled = false;

    function h(tag, cls, text) {
        var el = document.createElement(tag);
        if (cls) el.className = cls;
        if (text) el.textContent = text;
        return el;
    }

    function toast(msg, kind) {
        var el = document.getElementById('inline-edit-toast') || (function () {
            var t = h('div', 'inline-edit-toast');
            t.id = 'inline-edit-toast';
            document.body.appendChild(t);
            return t;
        })();
        el.textContent = msg;
        el.dataset.kind = kind || 'info';
        el.classList.add('is-visible');
        clearTimeout(el._timer);
        el._timer = setTimeout(function () { el.classList.remove('is-visible'); }, 4000);
    }

    /* Fetch the markdown source blocks for a file. The page itself only has
       the rendered html -- Jekyll converts collection documents before any
       template sees them -- so the source has to come from the edit server. */
    function sourceFor(container) {
        if (container._sourcePromise) return container._sourcePromise;
        var file = container.dataset.mdFile;
        container._sourcePromise = fetch(SERVER + '/source?file=' + encodeURIComponent(file))
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (!data.ok) throw new Error(data.error || 'source unavailable');
                return data.blocks;
            });
        return container._sourcePromise;
    }

    function words(text) {
        return (text || '').toLowerCase().replace(/[^a-z0-9\s]+/g, ' ')
            .split(/\s+/).filter(function (w) { return w.length >= 5; });
    }

    /* The rendered-block index and the source-block index line up in practice,
       but nothing guarantees it: kramdown decides where blank lines go in its
       output. So check the alignment before letting anyone type, and refuse
       rather than write into the wrong block. A shared-long-word overlap test
       tolerates markdown syntax (links, emphasis, math) while still rejecting
       a genuinely different paragraph. */
    function aligned(sourceBlock, block) {
        var domWords = words(block.textContent);
        if (!domWords.length) return true;              // image/hr-only block
        var hay = ' ' + (sourceBlock || '').toLowerCase() + ' ';
        var hits = domWords.filter(function (w) { return hay.indexOf(w) !== -1; }).length;
        return hits / domWords.length >= 0.6;
    }

    /* Remember which dialog was open and where we were, so the post-save
       reload does not throw away the reading position. */
    function rememberPosition(container) {
        var dialog = container.closest('dialog');
        var body = container.closest('.dialog-body') || container.parentElement;
        try {
            sessionStorage.setItem(RESTORE_KEY, JSON.stringify({
                dialog: dialog ? dialog.id : null,
                scroll: body ? body.scrollTop : 0
            }));
        } catch (err) { /* private mode; position is not worth failing over */ }
    }

    function restorePosition() {
        var raw;
        try {
            raw = sessionStorage.getItem(RESTORE_KEY);
            sessionStorage.removeItem(RESTORE_KEY);
        } catch (err) { return; }
        if (!raw) return;
        var state;
        try { state = JSON.parse(raw); } catch (err) { return; }
        if (!state || !state.dialog) return;

        var dialog = document.getElementById(state.dialog);
        if (!dialog) return;
        var slug = state.dialog.replace(/-dialog$/, '');
        // Reuse the page's own opener so its scroll-lock and MathJax hooks run.
        if (typeof window.showProjectDialog === 'function') {
            window.showProjectDialog(slug, null);
        } else if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        }
        var body = dialog.querySelector('.dialog-body');
        if (body) setTimeout(function () { body.scrollTop = state.scroll || 0; }, 120);
    }

    function closeEditor(block) {
        if (!block._editor || block._editor === 'pending') return;
        block._editor.remove();
        block._editor = null;
        block.classList.remove('is-editing');
        if (block._rendered !== undefined) block.innerHTML = block._rendered;
    }

    function save(block, container, index, original, text, statusEl) {
        statusEl.textContent = 'Saving…';
        fetch(SERVER + '/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: container.dataset.mdFile,
                index: index,
                expected: original,
                text: text
            })
        }).then(function (res) {
            return res.json().then(function (data) { return { status: res.status, data: data }; });
        }).then(function (r) {
            if (!r.data.ok) {
                statusEl.textContent = r.data.error || ('HTTP ' + r.status);
                statusEl.dataset.kind = 'error';
                return;
            }
            if (!r.data.changed) {
                statusEl.textContent = 'No change.';
                return;
            }
            rememberPosition(container);
            statusEl.textContent = 'Saved — reloading…';
            setTimeout(function () { location.reload(); }, RELOAD_DELAY);
        }).catch(function (err) {
            statusEl.textContent = 'Cannot reach the edit server on ' + SERVER +
                ' — start it with: python3 scripts/edit_server.py';
            statusEl.dataset.kind = 'error';
            console.error('[inline-edit]', err);
        });
    }

    function openEditor(block, container) {
        if (block._editor) return;
        block._editor = 'pending';
        sourceFor(container).then(function (blocks) {
            block._editor = null;
            var domCount = container.querySelectorAll('.md-block').length;
            // Trailing blank lines in the file produce empty source blocks that
            // kramdown drops from its output. They cannot shift any earlier
            // index, so discount them rather than refusing the whole file.
            var effective = blocks.length;
            while (effective > 0 && blocks[effective - 1].trim() === '') effective--;
            if (effective !== domCount) {
                return toast('Cannot edit ' + container.dataset.mdFile + ': the page has ' +
                    domCount + ' blocks but the file has ' + effective +
                    '. Edit the file directly.', 'error');
            }
            var index = parseInt(block.dataset.mdIndex, 10);
            var original = blocks[index];
            if (typeof original !== 'string') {
                return toast('Block ' + index + ' has no source; reload the page.', 'error');
            }
            if (!aligned(original, block)) {
                return toast('Block ' + index + ' does not match its source in ' +
                    container.dataset.mdFile + '. Refusing to edit it. Edit the file directly.', 'error');
            }
            mountEditor(block, container, index, original);
        }).catch(function (err) {
            block._editor = null;
            toast('Cannot reach the edit server on ' + SERVER +
                ' — start it with: python3 scripts/edit_server.py', 'error');
            console.error('[inline-edit]', err);
        });
    }

    function mountEditor(block, container, index, original) {
        if (block._rendered === undefined) block._rendered = block.innerHTML;
        block.classList.add('is-editing');
        block.innerHTML = '';

        var editor = h('div', 'md-editor');
        var area = h('textarea', 'md-editor-area');
        area.value = original;
        area.spellcheck = true;
        area.rows = Math.min(28, Math.max(3, original.split('\n').length + 2));

        var bar = h('div', 'md-editor-bar');
        var saveBtn = h('button', 'md-editor-save', 'Save');
        var cancelBtn = h('button', 'md-editor-cancel', 'Cancel');
        var status = h('span', 'md-editor-status');
        var hint = h('span', 'md-editor-hint', container.dataset.mdFile + ' · block ' + index + ' · ⌘/Ctrl+Enter to save, Esc to cancel');

        saveBtn.type = cancelBtn.type = 'button';
        bar.appendChild(saveBtn);
        bar.appendChild(cancelBtn);
        bar.appendChild(status);
        bar.appendChild(hint);
        editor.appendChild(area);
        editor.appendChild(bar);
        block.appendChild(editor);
        block._editor = editor;

        // Grow with content so long blocks stay fully visible.
        function autosize() {
            area.style.height = 'auto';
            area.style.height = Math.min(area.scrollHeight + 2, 640) + 'px';
        }
        area.addEventListener('input', autosize);
        autosize();
        area.focus();

        saveBtn.addEventListener('click', function () {
            save(block, container, index, original, area.value, status);
        });
        cancelBtn.addEventListener('click', function () { closeEditor(block); });
        area.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                ev.stopPropagation();   // do not let the dialog close instead
                closeEditor(block);
            } else if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') {
                ev.preventDefault();
                save(block, container, index, original, area.value, status);
            }
        });
        // Keep clicks inside the editor from re-triggering the block handler.
        editor.addEventListener('click', function (ev) { ev.stopPropagation(); });
    }

    function onBlockClick(ev) {
        if (!enabled) return;
        var block = ev.target.closest('.md-block');
        if (!block || block._editor) return;
        // Let real links and buttons behave normally.
        if (ev.target.closest('a, button, input, textarea, select, label')) return;
        var container = block.closest('.md-editable');
        if (!container) return;
        ev.preventDefault();
        openEditor(block, container);
    }

    function setEnabled(on) {
        enabled = on;
        document.body.classList.toggle('inline-edit-on', on);
        if (!on) {
            document.querySelectorAll('.md-block.is-editing').forEach(closeEditor);
        }
        var btn = document.getElementById('inline-edit-toggle');
        if (btn) {
            btn.textContent = on ? '✎ Editing on' : '✎ Edit text';
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        try { sessionStorage.setItem('inlineEdit.on', on ? '1' : '0'); } catch (err) { /* ignore */ }
    }

    function addToggle() {
        var btn = h('button', 'inline-edit-toggle', '✎ Edit text');
        btn.id = 'inline-edit-toggle';
        btn.type = 'button';
        btn.title = 'Click any paragraph to edit its markdown source (local only)';
        btn.addEventListener('click', function () { setEnabled(!enabled); });
        document.body.appendChild(btn);
    }

    function checkServer() {
        fetch(SERVER + '/health').then(function (r) { return r.json(); }).then(function (d) {
            if (d && d.ok) console.info('[inline-edit] edit server ready at ' + SERVER);
        }).catch(function () {
            console.warn('[inline-edit] edit server not running — start it with: python3 scripts/edit_server.py');
        });
    }

    function init() {
        if (!document.querySelector('.md-editable')) return;
        addToggle();
        document.addEventListener('click', onBlockClick, true);
        checkServer();
        var was;
        try { was = sessionStorage.getItem('inlineEdit.on'); } catch (err) { was = null; }
        if (was === '1') setEnabled(true);
        restorePosition();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
{%- endif -%}
