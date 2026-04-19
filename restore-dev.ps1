# ============================================================
#  restore-dev.ps1  —  Restauration branche dev (BOM cleanup)
#  Repo  : D:\boulot\dev\node\idae
#  Cible : reset --hard 8e01f4ff (avant commits BOM 9fc34f0d / e055cbe6)
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── Helpers ─────────────────────────────────────────────────
function Write-Header { param([string]$msg)
    Write-Host "`n━━━  $msg  ━━━" -ForegroundColor Cyan }

function Write-OK    { param([string]$msg) Write-Host "  ✔  $msg" -ForegroundColor Green  }
function Write-Warn  { param([string]$msg) Write-Host "  ⚠  $msg" -ForegroundColor Yellow }
function Write-Fail  { param([string]$msg) Write-Host "  ✘  $msg" -ForegroundColor Red; exit 1 }

# ── 0. Se placer dans le repo ────────────────────────────────
Write-Header "0 · Positionnement"
$repoPath = 'D:\boulot\dev\node\idae'

if (-not (Test-Path $repoPath)) {
    Write-Fail "Dossier introuvable : $repoPath"
}
Set-Location $repoPath
Write-OK "Répertoire courant : $(Get-Location)"

# ── 1. Vérification du remote ────────────────────────────────
Write-Header "1 · Vérification du remote"
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Fail "Aucun remote 'origin' trouvé. Mauvais dépôt ?"
}
Write-OK "Remote origin : $remoteUrl"

# Vérification loose : le nom du repo doit contenir "idae"
if ($remoteUrl -notmatch 'idae') {
    Write-Warn "Le remote ne semble pas être le repo 'idae' ($remoteUrl)."
    $confirm = Read-Host "  Continuer quand même ? (oui / non)"
    if ($confirm -ne 'oui') { Write-Fail "Opération annulée par l'utilisateur." }
}

# ── 2. Vérifier qu'on est sur dev ───────────────────────────
Write-Header "2 · Branche courante"
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne 'dev') {
    Write-Warn "Branche courante : '$currentBranch' (attendu : 'dev')"
    $confirm = Read-Host "  Basculer sur 'dev' automatiquement ? (oui / non)"
    if ($confirm -eq 'oui') {
        git checkout dev
        $currentBranch = git rev-parse --abbrev-ref HEAD
    } else {
        Write-Fail "Opération annulée. Basculez manuellement sur 'dev'."
    }
}
Write-OK "Branche active : $currentBranch"

# ── 3. Créer une branche de backup ──────────────────────────
Write-Header "3 · Backup"
$today      = Get-Date -Format 'yyyyMMdd'
$backupName = "dev-backup-$today"

$existing = git branch --list $backupName
if ($existing) {
    Write-Warn "La branche '$backupName' existe déjà. Backup ignoré."
} else {
    git branch $backupName
    Write-OK "Branche de backup créée : $backupName"
}

# Compter les fichiers BOM AVANT reset (fichier = exactement 3 octets = BOM seul)
Write-Header "4 · Audit BOM avant reset"
$goodCommit = '8e01f4ff'

$bomBefore = @(
    git ls-files -z |
    ForEach-Object -Begin { $buf = '' } -Process {
        $buf += $_
        # les entrées sont séparées par \0
        $parts = $buf -split "`0"
        for ($i = 0; $i -lt $parts.Count - 1; $i++) {
            if ($parts[$i] -ne '') { $parts[$i] }
        }
        $buf = $parts[-1]
    } |
    Where-Object {
        if (-not $_) { return $false }
        $fullPath = Join-Path (Get-Location) $_
        if (-not (Test-Path $fullPath -PathType Leaf)) { return $false }
        (Get-Item $fullPath).Length -eq 3
    }
)
$bomCountBefore = $bomBefore.Count
Write-OK "Fichiers BOM-only détectés avant reset : $bomCountBefore"

# ── 5. Reset hard ───────────────────────────────────────────
Write-Header "5 · Reset --hard vers $goodCommit"
git reset --hard $goodCommit
Write-OK "Reset effectué."

# ── 6. Vérification post-reset ───────────────────────────────
Write-Header "6 · Audit BOM après reset"
$bomAfter = @(
    git ls-files -z |
    ForEach-Object -Begin { $buf = '' } -Process {
        $buf += $_
        $parts = $buf -split "`0"
        for ($i = 0; $i -lt $parts.Count - 1; $i++) {
            if ($parts[$i] -ne '') { $parts[$i] }
        }
        $buf = $parts[-1]
    } |
    Where-Object {
        if (-not $_) { return $false }
        $fullPath = Join-Path (Get-Location) $_
        if (-not (Test-Path $fullPath -PathType Leaf)) { return $false }
        (Get-Item $fullPath).Length -eq 3
    }
)
$bomCountAfter = $bomAfter.Count

if ($bomCountAfter -eq 0) {
    Write-OK "Aucun fichier BOM-only restant. Branche propre."
} else {
    Write-Warn "$bomCountAfter fichier(s) BOM-only encore présents :"
    $bomAfter | ForEach-Object { Write-Host "      $_" -ForegroundColor Yellow }
}

# ── 7. Résumé ────────────────────────────────────────────────
Write-Header "7 · Résumé"
$headNow    = git rev-parse --short HEAD
$headMsg    = git log -1 --pretty=format:'%s'
$filesNow   = (git ls-files | Measure-Object).Count

Write-Host ""
Write-Host "  Repo         : $repoPath"               -ForegroundColor White
Write-Host "  Branche      : $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor White
Write-Host "  HEAD         : $headNow  —  $headMsg"   -ForegroundColor White
Write-Host "  Fichiers     : $filesNow fichiers trackés" -ForegroundColor White
Write-Host "  BOM supprimés: $($bomCountBefore - $bomCountAfter) / $bomCountBefore" -ForegroundColor White
Write-Host "  Backup       : $backupName"              -ForegroundColor White
Write-Host ""

# ── 8. Push optionnel ───────────────────────────────────────
Write-Header "8 · Push (optionnel)"
$hasRemote = git remote | Where-Object { $_ -eq 'origin' }

if (-not $hasRemote) {
    Write-Warn "Pas de remote 'origin'. Push ignoré."
} else {
    Write-Host ""
    Write-Host "  ⚠  ATTENTION : pusher 'dev' après un reset --hard nécessite un FORCE PUSH." -ForegroundColor Yellow
    Write-Host "     Cela réécrira l'historique distant et supprimera les commits BOM du remote." -ForegroundColor Yellow
    Write-Host ""
    $doPush = Read-Host "  Exécuter : git push --force origin dev ? (oui / non)"

    if ($doPush -eq 'oui') {
        git push --force origin dev
        Write-OK "Force push effectué sur origin/dev."

        # Pousser aussi le backup
        $doPushBackup = Read-Host "  Pousser aussi la branche backup '$backupName' ? (oui / non)"
        if ($doPushBackup -eq 'oui') {
            git push origin $backupName
            Write-OK "Backup poussé : origin/$backupName"
        }
    } else {
        Write-Warn "Push ignoré. Commandes manuelles si besoin :"
        Write-Host "     git push --force origin dev" -ForegroundColor Gray
        Write-Host "     git push origin $backupName"  -ForegroundColor Gray
    }
}

Write-Host ""
Write-OK "Script terminé."
