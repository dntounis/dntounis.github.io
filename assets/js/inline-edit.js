---
# Development-only asset: the body is emitted only when
# JEKYLL_ENV=development, so production ships an empty file.
---
{%- if jekyll.environment == "development" -%}
/*
 * In-page markdown editing (development only).
 *
 * Click text on the page and it becomes a textarea holding that block's
 * ORIGINAL MARKDOWN, fetched from scripts/edit_server.py. Saving rewrites just
 * that block in the source .md file.
 *
 * It edits the markdown source rather than the rendered text because these
 * pages contain MathJax and markdown links, and round-tripping rendered HTML
 * back to markdown corrupts both. Jekyll hands templates the already-rendered
 * content, so the source has to come off disk.
 *
 * Two ways of locating the block behind a click:
 *
 *   index mode  - projects. _includes/project-body.html wraps each rendered
 *                 block in a div carrying its index, so the block is known
 *                 directly. Verified against the source before editing.
 *   match mode  - pages such as index.md, which are largely hand-written HTML
 *                 with inline <script> blocks. Wrapping those in divs would
 *                 break HTML nesting, so instead the clicked element's text is
 *                 matched against the source blocks.
 *
 * Both modes refuse rather than guess, and the server independently rejects a
 * write whose block no longer matches what the page rendered.
 */
(function () {
    'use strict';

    var SERVER = 'http://127.0.0.1:' + (window.INLINE_EDIT_PORT || 4011);
    var RELOAD_DELAY = 1400;       // let Jekyll regenerate before reloading
    var MIN_MATCH_CHARS = 25;      // shorter text cannot be matched safely
    var AMBIGUOUS_RATIO = 0.85;    // two candidates this close are a refusal
    var PROSE = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, figcaption, dd, dt';
    var RESTORE_KEY = 'inlineEdit.restore';
    var enabled = false;

    function h(tag, cls, text) {
        var el = document.createElement(tag);
        if (cls) el.className = cls;
        if (text) el.textContent = text;
        return el;
    }

    function toast(msg, kind) {
        var el = document.getElementById('inline-edit-toast');
        if (!el) {
            el = h('div', 'inline-edit-toast');
            el.id = 'inline-edit-toast';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.dataset.kind = kind || 'info';
        el.classList.add('is-visible');
        clearTimeout(el._timer);
        el._timer = setTimeout(function () { el.classList.remove('is-visible'); }, 5000);
    }

    /* ---- source ---------------------------------------------------------- */

    var sourceCache = {};

    function sourceFor(file) {
        if (sourceCache[file]) return sourceCache[file];
        sourceCache[file] = fetch(SERVER + '/source?file=' + encodeURIComponent(file))
            .then(function (r) { return r.json(); })
            .then(function (d) {
                if (!d.ok) throw new Error(d.error || 'source unavailable');
                return d.blocks;
            });
        return sourceCache[file];
    }

    function normalize(s) {
        return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    }

    /* Markdown block reduced to comparable text: drop inline html, unwrap
       [label](url) to its label, then keep only alphanumerics. This is what
       lets a rendered paragraph match its source despite link and emphasis
       syntax. */
    function blockText(block) {
        return normalize(String(block)
            .replace(/<[^>]+>/g, ' ')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'));
    }

    function words(text) {
        return (text || '').toLowerCase().replace(/[^a-z0-9\s]+/g, ' ')
            .split(/\s+/).filter(function (w) { return w.length >= 5; });
    }

    /* Index mode sanity check. The rendered-block index and the source-block
       index line up in practice, but kramdown decides where blank lines go in
       its output, so verify before writing into a block. Long-word overlap
       tolerates markdown syntax while still rejecting a different paragraph. */
    function aligned(sourceBlock, el) {
        var domWords = words(el.textContent);
        if (!domWords.length) return true;                  // image/rule-only block
        var hay = ' ' + String(sourceBlock).toLowerCase() + ' ';
        var hits = domWords.filter(function (w) { return hay.indexOf(w) !== -1; }).length;
        return hits / domWords.length >= 0.6;
    }

    /* Match mode. Prefer the tightest containing block: a short list item lives
       inside its own short list block, not inside some long paragraph that
       happens to repeat the phrase. Refuse when the top two are close. */
    function matchBlock(blocks, el) {
        var t = normalize(el.textContent);
        if (t.length < MIN_MATCH_CHARS) {
            return { error: 'that text is too short to match to the source safely' };
        }
        var cands = [];
        for (var i = 0; i < blocks.length; i++) {
            var n = blockText(blocks[i]);
            if (n && n.indexOf(t) !== -1) cands.push({ index: i, ratio: t.length / n.length });
        }
        if (!cands.length) return { error: 'no source block contains that text' };
        cands.sort(function (a, b) { return b.ratio - a.ratio; });
        if (cands.length > 1 && cands[1].ratio / cands[0].ratio > AMBIGUOUS_RATIO) {
            return {
                error: 'that text appears in blocks ' +
                    cands.map(function (c) { return c.index; }).join(' and ') +
                    ' — too ambiguous to edit safely'
            };
        }
        return { index: cands[0].index };
    }

    /* ---- reading position across the post-save reload -------------------- */

    function rememberPosition(container) {
        var dialog = container.closest ? container.closest('dialog') : null;
        var body = container.closest ? (container.closest('.dialog-body') || null) : null;
        try {
            sessionStorage.setItem(RESTORE_KEY, JSON.stringify({
                dialog: dialog ? dialog.id : null,
                scroll: body ? body.scrollTop : window.scrollY
            }));
        } catch (err) { /* private mode; not worth failing over */ }
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
        if (!state) return;

        if (!state.dialog) {
            window.scrollTo(0, state.scroll || 0);
            return;
        }
        var dialog = document.getElementById(state.dialog);
        if (!dialog) return;
        var slug = state.dialog.replace(/-dialog$/, '');
        // Reuse the page's own opener so its scroll lock and MathJax hooks run.
        if (typeof window.showProjectDialog === 'function') {
            window.showProjectDialog(slug, null);
        } else if (typeof dialog.showModal === 'function') {
            dialog.showModal();
        }
        var body = dialog.querySelector('.dialog-body');
        if (body) setTimeout(function () { body.scrollTop = state.scroll || 0; }, 120);
    }

    /* ---- editor ---------------------------------------------------------- */

    var openEditors = [];

    /* Where to put the editor. Inserting after the element keeps the rendered
       page intact (no innerHTML surgery); for a list item, go up to the list so
       the markup stays valid. */
    function anchorFor(el) {
        if (el.tagName === 'LI' || el.tagName === 'DD' || el.tagName === 'DT') {
            return el.closest('ul, ol, dl') || el;
        }
        return el;
    }

    function closeEditor(rec) {
        rec.editor.remove();
        rec.anchor.classList.remove('md-anchor-editing');
        var i = openEditors.indexOf(rec);
        if (i !== -1) openEditors.splice(i, 1);
    }

    function closeAll() {
        openEditors.slice().forEach(closeEditor);
    }

    function mountEditor(file, container, index, original, el) {
        var anchor = anchorFor(el);
        if (anchor._mdEditor) return;

        var editor = h('div', 'md-editor');
        var area = h('textarea', 'md-editor-area');
        area.value = original;
        area.spellcheck = true;

        var bar = h('div', 'md-editor-bar');
        var saveBtn = h('button', 'md-editor-save', 'Save');
        var cancelBtn = h('button', 'md-editor-cancel', 'Cancel');
        var status = h('span', 'md-editor-status');
        var hint = h('span', 'md-editor-hint', file + ' · block ' + index +
            ' · ⌘/Ctrl+Enter to save, Esc to cancel');
        saveBtn.type = cancelBtn.type = 'button';
        bar.appendChild(saveBtn);
        bar.appendChild(cancelBtn);
        bar.appendChild(status);
        bar.appendChild(hint);
        editor.appendChild(area);
        editor.appendChild(bar);

        anchor.classList.add('md-anchor-editing');
        anchor.parentNode.insertBefore(editor, anchor.nextSibling);

        var rec = { editor: editor, anchor: anchor };
        openEditors.push(rec);

        function autosize() {
            area.style.height = 'auto';
            area.style.height = Math.min(area.scrollHeight + 4, 640) + 'px';
        }
        area.addEventListener('input', autosize);
        autosize();
        area.focus();
        area.setSelectionRange(area.value.length, area.value.length);

        function doSave() {
            status.dataset.kind = 'info';
            status.textContent = 'Saving…';
            fetch(SERVER + '/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: file, index: index, expected: original, text: area.value })
            }).then(function (res) {
                return res.json().then(function (d) { return { status: res.status, data: d }; });
            }).then(function (r) {
                if (!r.data.ok) {
                    status.dataset.kind = 'error';
                    status.textContent = r.data.error || ('HTTP ' + r.status);
                    return;
                }
                if (!r.data.changed) { status.textContent = 'No change.'; return; }
                rememberPosition(container);
                status.textContent = 'Saved — reloading…';
                setTimeout(function () { location.reload(); }, RELOAD_DELAY);
            }).catch(function (err) {
                status.dataset.kind = 'error';
                status.textContent = 'Cannot reach the edit server on ' + SERVER;
                console.error('[inline-edit]', err);
            });
        }

        saveBtn.addEventListener('click', doSave);
        cancelBtn.addEventListener('click', function () { closeEditor(rec); });
        area.addEventListener('keydown', function (ev) {
            if (ev.key === 'Escape') {
                ev.stopPropagation();        // do not let the dialog close instead
                closeEditor(rec);
            } else if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') {
                ev.preventDefault();
                doSave();
            }
        });
        editor.addEventListener('click', function (ev) { ev.stopPropagation(); });
    }

    /* ---- click handling -------------------------------------------------- */

    function handle(ev) {
        if (!enabled) return;
        if (ev.target.closest('.md-editor, a, button, input, textarea, select, label, script')) return;

        var container = ev.target.closest('[data-md-file]');
        if (!container) return;
        var file = container.dataset.mdFile;

        var block = ev.target.closest('.md-block');
        var el = block || ev.target.closest(PROSE);
        if (!el || !container.contains(el)) return;
        if (anchorFor(el).classList.contains('md-anchor-editing')) return;

        ev.preventDefault();
        ev.stopPropagation();

        sourceFor(file).then(function (blocks) {
            var index, original;

            if (block) {
                // index mode: discount trailing blank lines, which cannot shift
                // an earlier index, then confirm the counts agree.
                var domCount = container.querySelectorAll('.md-block').length;
                var effective = blocks.length;
                while (effective > 0 && String(blocks[effective - 1]).trim() === '') effective--;
                if (effective !== domCount) {
                    return toast('Cannot edit ' + file + ': the page has ' + domCount +
                        ' blocks but the file has ' + effective + '. Edit the file directly.', 'error');
                }
                index = parseInt(block.dataset.mdIndex, 10);
                original = blocks[index];
                if (typeof original !== 'string') {
                    return toast('Block ' + index + ' has no source; reload the page.', 'error');
                }
                if (!aligned(original, block)) {
                    return toast('Block ' + index + ' does not match its source in ' + file +
                        '. Refusing to edit it.', 'error');
                }
            } else {
                var m = matchBlock(blocks, el);
                if (m.error) return toast(m.error + ' (' + file + ')', 'error');
                index = m.index;
                original = blocks[index];
            }

            mountEditor(file, container, index, original, el);
        }).catch(function (err) {
            toast('Cannot reach the edit server on ' + SERVER +
                ' — start it with: python3 scripts/edit_server.py', 'error');
            console.error('[inline-edit]', err);
        });
    }

    /* ---- toggle --------------------------------------------------------- */

    function setEnabled(on) {
        enabled = on;
        document.body.classList.toggle('inline-edit-on', on);
        if (!on) closeAll();
        var btn = document.getElementById('inline-edit-toggle');
        if (btn) {
            btn.textContent = on ? '✎ Editing on' : '✎ Edit text';
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        try { sessionStorage.setItem('inlineEdit.on', on ? '1' : '0'); } catch (err) { /* ignore */ }
    }

    function init() {
        if (!document.querySelector('[data-md-file]')) return;

        var btn = h('button', 'inline-edit-toggle', '✎ Edit text');
        btn.id = 'inline-edit-toggle';
        btn.type = 'button';
        btn.title = 'Click text to edit its markdown source (local only)';
        btn.addEventListener('click', function () { setEnabled(!enabled); });
        document.body.appendChild(btn);

        document.addEventListener('click', handle, true);

        fetch(SERVER + '/health').then(function (r) { return r.json(); }).then(function (d) {
            if (d && d.ok) console.info('[inline-edit] edit server ready at ' + SERVER);
        }).catch(function () {
            console.warn('[inline-edit] edit server not running — python3 scripts/edit_server.py');
        });

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
