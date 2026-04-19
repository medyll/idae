#!/usr/bin/env python3
"""
bom_restore.py — Restauration automatique des fichiers BOM-only dans les repos git.

Approche batch : parcours l'historique git en UNE seule passe par repo,
sans appeler git log pour chaque fichier individuellement (très rapide).

Usage:
  # Dry-run sur un projet :
  python3 bom_restore.py --root /path/to/project

  # Dry-run + sauvegarder les commandes :
  python3 bom_restore.py --root /path/to/project --report restore.sh

  # Appliquer les restaurations :
  python3 bom_restore.py --root /path/to/project --apply

  # Cibler un sous-projet par nom :
  python3 bom_restore.py --root /path/to/dev --project idae-dashboard

Options:
  --dry-run     Affiche les commandes sans les exécuter (défaut)
  --apply       Exécute vraiment les git checkout
  --root PATH   Répertoire racine à scanner
  --project P   Nom du projet à cibler
  --report F    Fichier de sortie pour les commandes shell
  --max-commits N  Nombre max de commits à parcourir (défaut: 200)
"""

import os
import sys
import subprocess
import argparse
import time
from pathlib import Path

BOM = b'\xef\xbb\xbf'
SKIP_DIRS = {
    'node_modules', '.svelte-kit', 'dist', 'build', 'target',
    'vendor', '.vite', '.tshy', '__pycache__', '.git',
    'playwright-report', 'playwright-report-a11y', 'test-results',
}


def is_bom_only(path: Path) -> bool:
    try:
        if path.stat().st_size != 3:
            return False
        return path.read_bytes() == BOM
    except Exception:
        return False


def find_git_repos(root: Path) -> list[Path]:
    repos = []
    for dirpath, dirnames, _ in os.walk(root):
        dp = Path(dirpath)
        if '.git' in dirnames:
            repos.append(dp)
            dirnames[:] = []
        else:
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    return repos


def get_tracked_bom_files(repo: Path) -> set[str]:
    """Retourne l'ensemble des chemins relatifs (str) de fichiers BOM-only trackés par git."""
    try:
        result = subprocess.run(
            ['git', 'ls-files'],
            cwd=repo, capture_output=True, text=True, timeout=30
        )
        if result.returncode != 0:
            return set()
    except Exception:
        return set()

    bom_files = set()
    for relpath in result.stdout.splitlines():
        full = repo / relpath
        if is_bom_only(full):
            bom_files.add(relpath)
    return bom_files


def find_last_good_commits_batch(repo: Path, bom_files: set[str], max_commits: int = 200) -> dict[str, tuple[str, int]]:
    """
    Parcourt l'historique git une seule fois (batch) et trouve, pour chaque fichier BOM,
    le dernier commit où son contenu était > 3 octets.

    Retourne: { relpath: (commit_hash, size) }
    """
    results: dict[str, tuple[str, int]] = {}
    remaining = set(bom_files)  # fichiers pour lesquels on cherche encore un bon commit

    if not remaining:
        return results

    try:
        # Récupérer les N derniers commits
        log_result = subprocess.run(
            ['git', 'log', '--format=%H', f'-{max_commits}'],
            cwd=repo, capture_output=True, text=True, timeout=15
        )
        commits = log_result.stdout.strip().splitlines()
    except Exception:
        return results

    print(f"   📜 {len(commits)} commits à analyser pour {len(remaining)} fichiers BOM...")

    for i, commit in enumerate(commits):
        if not remaining:
            break

        # Pour ce commit, récupérer les blobs des fichiers qui nous intéressent
        # On utilise git ls-tree pour lister les fichiers du commit
        # Mais c'est trop lent pour chaque commit. Approche plus rapide :
        # git diff-tree pour voir CE QUE ce commit a changé
        try:
            diff_result = subprocess.run(
                ['git', 'diff-tree', '--no-commit-id', '-r', '--name-only', commit],
                cwd=repo, capture_output=True, text=True, timeout=5
            )
            changed_in_commit = set(diff_result.stdout.strip().splitlines())
        except Exception:
            changed_in_commit = set()

        # Parmi les fichiers BOM restants, on s'intéresse à ceux modifiés dans ce commit
        candidates = remaining & changed_in_commit

        if not candidates:
            continue

        for relpath in list(candidates):
            try:
                size_result = subprocess.run(
                    ['git', 'cat-file', '-s', f'{commit}:{relpath}'],
                    cwd=repo, capture_output=True, text=True, timeout=5
                )
                if size_result.returncode == 0:
                    size = int(size_result.stdout.strip())
                    if size > 3:
                        results[relpath] = (commit, size)
                        remaining.discard(relpath)
            except Exception:
                pass

        if (i + 1) % 20 == 0:
            print(f"   ... {i+1}/{len(commits)} commits parcourus, {len(remaining)} fichiers restants")

    # Fichiers sans bon commit trouvé dans les N derniers commits
    # Tenter une recherche exhaustive pour les fichiers restants
    if remaining:
        print(f"   ⚠️  {len(remaining)} fichiers sans bon commit dans les {max_commits} derniers commits")
        print(f"       Recherche étendue...")
        for relpath in list(remaining):
            try:
                log_r = subprocess.run(
                    ['git', 'log', '--format=%H', '--', relpath],
                    cwd=repo, capture_output=True, text=True, timeout=10
                )
                for commit in log_r.stdout.strip().splitlines():
                    size_r = subprocess.run(
                        ['git', 'cat-file', '-s', f'{commit}:{relpath}'],
                        cwd=repo, capture_output=True, text=True, timeout=5
                    )
                    if size_r.returncode == 0:
                        size = int(size_r.stdout.strip())
                        if size > 3:
                            results[relpath] = (commit, size)
                            remaining.discard(relpath)
                            break
            except Exception:
                pass

    return results


def process_repo(repo: Path, dry_run: bool, max_commits: int, out_lines: list) -> dict:
    stats = {
        'repo': str(repo),
        'bom_count': 0,
        'restorable': 0,
        'no_history': 0,
    }

    print(f"\n{'='*60}")
    print(f"📁 {repo.name}  ({repo})")

    bom_files = get_tracked_bom_files(repo)
    stats['bom_count'] = len(bom_files)

    if not bom_files:
        print(f"   ✅ Aucun fichier BOM-only tracké.")
        return stats

    print(f"   🔴 {len(bom_files)} fichiers BOM-only")
    if dry_run:
        print(f"   [DRY-RUN — aucune modification]")

    good_commits = find_last_good_commits_batch(repo, bom_files, max_commits)

    # Fichiers restorables
    for relpath, (commit, size) in sorted(good_commits.items()):
        stats['restorable'] += 1
        rel = relpath.replace('\\', '/')
        cmd = f"git -C '{repo}' checkout {commit} -- '{rel}'"
        out_lines.append(cmd)

        if dry_run:
            print(f"   🔧 {relpath:<60} ← {commit[:8]}  ({size:,} o)")
        else:
            try:
                result = subprocess.run(
                    ['git', 'checkout', commit, '--', relpath],
                    cwd=repo, capture_output=True, text=True, timeout=10
                )
                if result.returncode == 0:
                    print(f"   ✅ {relpath}")
                else:
                    print(f"   ❌ ÉCHEC : {relpath} — {result.stderr.strip()}")
            except Exception as e:
                print(f"   ❌ EXCEPTION : {relpath} — {e}")

    # Fichiers sans historique valide
    no_hist = bom_files - set(good_commits.keys())
    stats['no_history'] = len(no_hist)
    if no_hist:
        out_lines.append(f"\n# ⚠️  Fichiers sans bon commit dans {repo} :")
        for f in sorted(no_hist):
            print(f"   ❓ SANS HISTORIQUE : {f}")
            out_lines.append(f"# NO_HISTORY: {f}")

    return stats


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default='/sessions/relaxed-hopeful-archimedes/mnt/dev')
    parser.add_argument('--project', default=None)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--report', default=None)
    parser.add_argument('--max-commits', type=int, default=200)
    args = parser.parse_args()

    dry_run = not args.apply
    root = Path(args.root)

    print(f"🔍 Scan de : {root}")
    print(f"🛡️  Mode : {'DRY-RUN' if dry_run else '⚠️  APPLY — modifications réelles'}")

    repos = find_git_repos(root)

    if args.project:
        repos = [r for r in repos if r.name == args.project]
        if not repos:
            print(f"❌ Projet '{args.project}' introuvable sous {root}")
            sys.exit(1)

    print(f"{len(repos)} repo(s) trouvé(s)\n")

    all_commands: list[str] = []
    all_stats = []
    t0 = time.time()

    for repo in repos:
        stats = process_repo(repo, dry_run, args.max_commits, all_commands)
        all_stats.append(stats)

    total_bom = sum(s['bom_count'] for s in all_stats)
    total_rest = sum(s['restorable'] for s in all_stats)
    total_noh = sum(s['no_history'] for s in all_stats)
    elapsed = time.time() - t0

    print(f"\n{'='*60}")
    print(f"📊 RÉSUMÉ")
    print(f"   Repos          : {len(repos)}")
    print(f"   Fichiers BOM   : {total_bom}")
    print(f"   Restaurables   : {total_rest}")
    print(f"   Sans historique: {total_noh}")
    print(f"   Durée          : {elapsed:.1f}s")

    if args.report and all_commands:
        Path(args.report).write_text('#!/bin/bash\n' + '\n'.join(all_commands) + '\n', encoding='utf-8')
        print(f"\n💾 Script sauvegardé : {args.report}")

    if dry_run and total_bom > 0:
        print(f"\n💡 Pour restaurer, relancez avec --apply")


if __name__ == '__main__':
    main()
