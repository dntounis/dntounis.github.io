#!/usr/bin/env python3
"""Local write-back server for in-page markdown editing.

Pairs with assets/js/inline-edit.js. The browser sends one edited markdown
block; this rewrites that block in the source .md file and leaves everything
else byte-identical.

    python3 scripts/edit_server.py            # then: bundle exec jekyll serve --livereload

Development only. Binds to 127.0.0.1 so nothing outside this machine can
reach it, and refuses any path that is not a markdown file inside
EDITABLE_DIRS or named in EDITABLE_FILES.
"""

import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDITABLE_DIRS = ("_projects",)
EDITABLE_FILES = ("index.md",)   # specific root-level pages
SEP = "\n\n"
PORT = int(os.environ.get("EDIT_SERVER_PORT", "4011"))

# Jekyll strips front matter with this shape; we must split identically so that
# the body we index into is the same string Liquid split on.
FRONT_MATTER = re.compile(r"\A(---\s*\n.*?\n?)^((---|\.\.\.)\s*$\n?)", re.M | re.S)


class Refused(Exception):
    """A request we decline to act on, reported back to the browser."""


def resolve(rel_path):
    """Map a site-relative path to an absolute one, or refuse."""
    if not rel_path or os.path.isabs(rel_path) or "\x00" in rel_path:
        raise Refused("bad path: %r" % (rel_path,))
    full = os.path.realpath(os.path.join(SITE_ROOT, rel_path))
    root = os.path.realpath(SITE_ROOT)
    if not (full == root or full.startswith(root + os.sep)):
        raise Refused("path escapes the site root: %r" % (rel_path,))
    if not full.endswith((".md", ".markdown")):
        raise Refused("not a markdown file: %r" % (rel_path,))
    inside = os.path.relpath(full, root)
    if inside not in EDITABLE_FILES and inside.split(os.sep)[0] not in EDITABLE_DIRS:
        raise Refused("%r is not editable; allowed: %s and %s"
                      % (rel_path, list(EDITABLE_DIRS), list(EDITABLE_FILES)))
    if not os.path.isfile(full):
        raise Refused("no such file: %r" % (rel_path,))
    return full


def split_source(raw):
    """Return (front_matter, body) exactly as Jekyll would."""
    m = FRONT_MATTER.match(raw)
    if not m:
        return "", raw
    return raw[: m.end()], raw[m.end():]


def apply_edit(full_path, index, expected, replacement):
    with open(full_path, encoding="utf-8") as fh:
        raw = fh.read()

    front, body = split_source(raw)
    blocks = body.split(SEP)

    # Refuse unless our own split is lossless; if it is not, an in-place write
    # would silently reflow the rest of the file.
    if SEP.join(blocks) != body:
        raise Refused("block split is not lossless for this file; refusing to write")
    if not 0 <= index < len(blocks):
        raise Refused("block %d out of range (file has %d)" % (index, len(blocks)))

    # Optimistic concurrency: the file may have changed under the open page.
    if expected is not None and blocks[index] != expected:
        raise Refused("block %d changed on disk since the page was rendered; reload and retry" % index)

    if blocks[index] == replacement:
        return False, len(blocks)

    if replacement.strip() == "" and blocks[index].strip() != "":
        # Emptying a block means "delete this paragraph". Leaving a blank block
        # behind would desync the source block count from the rendered one and
        # lock further editing of the file, so drop it entirely.
        del blocks[index]
    else:
        blocks[index] = replacement
    new_body = SEP.join(blocks)
    # Deleting the last block takes the file's trailing newline with it, since
    # that newline lived inside the deleted text. Put it back.
    if body.endswith("\n") and not new_body.endswith("\n"):
        new_body += "\n"

    with open(full_path, "w", encoding="utf-8") as fh:
        fh.write(front + new_body)
    return True, len(blocks)


class Handler(BaseHTTPRequestHandler):
    server_version = "inline-edit/1.0"

    def _cors(self):
        origin = self.headers.get("Origin", "")
        # Only ever echo a loopback origin back.
        if re.match(r"^http://(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$", origin):
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _reply(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        import urllib.parse as up
        parts = up.urlsplit(self.path)
        route = parts.path.rstrip("/")

        if route in ("/health", ""):
            return self._reply(200, {"ok": True, "root": SITE_ROOT, "editable": list(EDITABLE_DIRS) + list(EDITABLE_FILES)})

        if route == "/source":
            # The page cannot read the markdown itself: Jekyll hands templates the
            # RENDERED html, so the source blocks have to come from disk.
            try:
                rel = (up.parse_qs(parts.query).get("file") or [None])[0]
                full = resolve(rel)
                with open(full, encoding="utf-8") as fh:
                    raw = fh.read()
                _, body = split_source(raw)
                blocks = body.split(SEP)
                if SEP.join(blocks) != body:
                    raise Refused("block split is not lossless for this file")
            except Refused as exc:
                return self._reply(409, {"ok": False, "error": str(exc)})
            except Exception as exc:  # noqa: BLE001
                return self._reply(500, {"ok": False, "error": "%s: %s" % (type(exc).__name__, exc)})
            return self._reply(200, {"ok": True, "file": rel, "blocks": blocks})

        self._reply(404, {"ok": False, "error": "not found"})

    def do_POST(self):
        if self.path.rstrip("/") != "/save":
            return self._reply(404, {"ok": False, "error": "not found"})
        try:
            length = int(self.headers.get("Content-Length") or 0)
            if length <= 0 or length > 2_000_000:
                raise Refused("missing or oversized body")
            req = json.loads(self.rfile.read(length).decode("utf-8"))
            full = resolve(req.get("file"))
            index = req.get("index")
            if not isinstance(index, int):
                raise Refused("index must be an integer")
            text = req.get("text")
            if not isinstance(text, str):
                raise Refused("text must be a string")
            changed, total = apply_edit(full, index, req.get("expected"), text)
        except Refused as exc:
            self.log_message("refused: %s", exc)
            return self._reply(409, {"ok": False, "error": str(exc)})
        except Exception as exc:  # noqa: BLE001 - report anything else to the page
            self.log_message("error: %r", exc)
            return self._reply(500, {"ok": False, "error": "%s: %s" % (type(exc).__name__, exc)})

        rel = os.path.relpath(full, SITE_ROOT)
        self.log_message("%s block %d/%d %s", rel, index, total, "written" if changed else "unchanged")
        self._reply(200, {"ok": True, "file": rel, "index": index, "changed": changed})

    def log_message(self, fmt, *args):
        sys.stderr.write("[edit-server] " + (fmt % args) + "\n")


def main():
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("[edit-server] writing into %s under %s" % (list(EDITABLE_DIRS), SITE_ROOT))
    print("[edit-server] listening on http://127.0.0.1:%d  (Ctrl-C to stop)" % PORT)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n[edit-server] stopped")


if __name__ == "__main__":
    main()
