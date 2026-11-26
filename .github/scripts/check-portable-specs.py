#!/usr/bin/env python3
"""Fail CI when a dependency spec would break a Linux build or a published package.

Deterministic check, no network. Runs in CI before install and publish.

State rules (always checked, on every tracked manifest and lockfile):
  R3  a link:/file: spec contains a backslash (Windows path written by pnpm);
  R4  a pnpm-lock.yaml specifier/version link:/file: contains a backslash;
  R5  a package that is not "private" has link:/file: in its runtime
      dependencies (consumers cannot resolve it; publint rejects it);
  R6  link: in a directory managed by npm (package-lock.json): npm does not
      support the link: protocol.
Diff rules (with --base REV, when that commit is available locally):
  R1  a local spec (link:, file:, workspace:, portal:) was rewritten, other
      than its slashes or link: <-> file: on the same path;
  R2  a registry range was turned into a link:/file: path.
Absolute local paths (file:D:/...) are reported as warnings.

Usage:
  python3 check-portable-specs.py [REPO] [--base REV] [--fix]
--fix (local use) restores the BASE spec for R1/R2 and normalises slashes for
R3, keeping formatting; regenerate the lockfile afterwards.
Exit code: 0 clean, 1 violations, 2 usage or git error.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path, PurePosixPath

SECTIONS = ("dependencies", "devDependencies", "optionalDependencies", "peerDependencies")
LOCAL_PREFIXES = ("link:", "file:", "workspace:", "portal:")
PATH_PREFIXES = ("link:", "file:")
EXCLUDED_PARTS = {"node_modules", "vendor", "dist", "build", ".svelte-kit"}
ABSOLUTE_PATH = re.compile(r"^(link|file):(/|[A-Za-z]:[\\/])")
LOCK_BACKSLASH = re.compile(r"^\s*(specifier|version): (link|file):.*\\")
NULL_SHA = re.compile(r"^0+$")


def git(repo: Path, *args: str) -> str:
    proc = subprocess.run(["git", "-C", str(repo), *args], capture_output=True,
                          text=True, encoding="utf-8", errors="replace")
    if proc.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)}: {proc.stderr.strip()}")
    return proc.stdout


def tracked(repo: Path, name: str) -> list[str]:
    files = git(repo, "ls-files", "-z", "--", name, f"**/{name}").split("\0")
    return [f for f in files if f and PurePosixPath(f).name == name
            and not EXCLUDED_PARTS.intersection(PurePosixPath(f).parts)]


def deps(manifest: dict) -> dict[tuple[str, str], str]:
    return {(s, n): str(v) for s in SECTIONS for n, v in (manifest.get(s) or {}).items()}


def path_of(spec: str) -> str | None:
    if not spec.startswith(PATH_PREFIXES):
        return None
    return spec.split(":", 1)[1].replace("\\", "/")


def violation(rel, section, name, rule, found, restore):
    return {"file": rel, "section": section, "dependency": name, "rule": rule,
            "found": found, "restore": restore}


def check_state(repo: Path, rel: str, manifest: dict) -> tuple[list[dict], list[dict]]:
    found, warnings = [], []
    published = not manifest.get("private", False)
    npm_dir = (repo / PurePosixPath(rel).parent / "package-lock.json").exists()
    for (section, name), spec in deps(manifest).items():
        if not spec.startswith(PATH_PREFIXES):
            continue
        if published and section != "devDependencies":
            found.append(violation(rel, section, name,
                                   "R5 local path in a published package's runtime dependencies", spec, None))
        elif "\\" in spec:
            found.append(violation(rel, section, name, "R3 backslash in local path",
                                   spec, spec.replace("\\", "/")))
        if npm_dir and spec.startswith("link:"):
            found.append(violation(rel, section, name, "R6 link: is not supported by npm",
                                   spec, "file:" + path_of(spec)))
        if ABSOLUTE_PATH.match(spec):
            warnings.append({"file": rel, "dependency": name, "spec": spec,
                             "warning": "absolute local path is not portable"})
    return found, warnings


def check_diff(rel: str, old: dict, new: dict) -> list[dict]:
    found = []
    before = deps(old)
    published = not new.get("private", False)
    for (section, name), spec in deps(new).items():
        prev = before.get((section, name))
        if prev is None or prev == spec:
            continue
        runtime = published and section != "devDependencies"
        if (is_local := prev.startswith(LOCAL_PREFIXES)) and not (runtime and prev.startswith(PATH_PREFIXES)) \
                and not (path_of(prev) is not None and path_of(prev) == path_of(spec)):
            found.append(violation(rel, section, name, "R1 local spec rewritten", spec,
                                   prev.replace("\\", "/") if prev.startswith(PATH_PREFIXES) else prev))
        elif not is_local and spec.startswith(PATH_PREFIXES):
            found.append(violation(rel, section, name, "R2 registry range turned into a local path", spec, prev))
    return found


def check_lockfiles(repo: Path) -> list[dict]:
    issues = []
    for rel in tracked(repo, "pnpm-lock.yaml"):
        text = (repo / rel).read_text(encoding="utf-8", errors="replace")
        for lineno, line in enumerate(text.splitlines(), 1):
            if LOCK_BACKSLASH.match(line):
                issues.append({"file": rel, "line": lineno, "rule": "R4 backslash in lockfile spec",
                               "found": line.strip()})
    return issues


def apply_fixes(path: Path, fixes: list[dict]) -> None:
    raw = path.read_bytes().decode("utf-8-sig")
    text = raw
    for fx in fixes:
        name = json.dumps(fx["dependency"])
        pattern = re.compile(re.escape(name) + r"(\s*:\s*)" + re.escape(json.dumps(fx["found"])))
        text, count = pattern.subn(lambda m: name + m.group(1) + json.dumps(fx["restore"]), text, count=1)
        if count == 0:
            raise RuntimeError(f"{path}: could not locate {fx['dependency']} = {fx['found']}")
    if text != raw:
        path.write_bytes(text.encode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("repo", nargs="?", default=".", type=Path)
    parser.add_argument("--base", default="", help="commit to diff against (ignored if empty, null or absent)")
    parser.add_argument("--fix", action="store_true")
    args = parser.parse_args()

    try:
        repo = Path(git(args.repo, "rev-parse", "--show-toplevel").strip())
        base = args.base.strip()
        notes = []
        if base and (NULL_SHA.match(base) or subprocess.run(
                ["git", "-C", str(repo), "cat-file", "-e", f"{base}^{{commit}}"], capture_output=True).returncode):
            notes.append(f"base {base} not available: diff rules skipped")
            base = ""
        violations, warnings = [], []
        for rel in tracked(repo, "package.json"):
            manifest = json.loads((repo / rel).read_text(encoding="utf-8-sig"))
            found, warn = check_state(repo, rel, manifest)
            warnings += warn
            if base:
                try:
                    old = json.loads(git(repo, "show", f"{base}:{rel}"))
                except RuntimeError:
                    old = None
                if old is not None:
                    seen = {(v["section"], v["dependency"]) for v in found}
                    found += [v for v in check_diff(rel, old, manifest)
                              if (v["section"], v["dependency"]) not in seen]
            violations += found
        lockfile = check_lockfiles(repo)
        fixed = []
        if args.fix:
            by_file: dict[str, list[dict]] = {}
            for v in violations:
                if v["restore"] is not None:
                    by_file.setdefault(v["file"], []).append(v)
            for rel, fixes in by_file.items():
                apply_fixes(repo / rel, fixes)
                fixed += fixes
            violations = [v for v in violations if v["restore"] is None]
    except (RuntimeError, json.JSONDecodeError) as exc:
        print(f"check-portable-specs: {exc}", file=sys.stderr)
        return 2

    for n in notes:
        print(f"note: {n}")
    for w in warnings:
        print(f"warning: {w['file']}: {w['dependency']} = {w['spec']} ({w['warning']})")
    for v in fixed:
        print(f"fixed: {v['file']}: {v['dependency']} {v['found']} -> {v['restore']} ({v['rule']})")
    for v in violations:
        hint = f" (expected {v['restore']})" if v["restore"] else ""
        print(f"::error file={v['file']}::{v['rule']}: {v['dependency']} = {v['found']}{hint}")
    for l in lockfile:
        print(f"::error file={l['file']},line={l['line']}::{l['rule']}: {l['found']}")
    if fixed:
        print("Regenerate the lockfile (pnpm install --lockfile-only), then run this check again.")
    if violations or lockfile or fixed:
        return 1
    print("check-portable-specs: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
