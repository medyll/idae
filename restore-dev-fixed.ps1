# ============================================================
#  restore-dev-fixed.ps1  - Restauration branche dev (BOM cleanup)
#  Repo  : D:\boulot\dev\node\idae
#  Cible : reset --hard 8e01f4ff (avant commits BOM 9fc34f0d / e055cbe6)
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# -- Helpers -------------------------------------------------
function Write-Header { param([string]$msg)
    Write-Host "`n---  $msg  ---" -ForegroundColor Cyan }

function Write-OK    { param([string]$msg) Write-Host "  [OK]   $msg" -ForegroundColor Green  }
function Write-Warn  { param([string]$msg) Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Write-Fail  { param([string]$msg) Write-Host "  [FAIL] $msg" -ForegroundColor Red; exit 1 }

# -- 0. Se placer dans le repo --------------------------------
Write-Header "0 - Positionnement"
$repoPath = 'D:\boulot\dev\node\idae'

if (-not (Test-Path $repoPath)) {
    Write-Fail "Dossier introuvable : $repoPath"
}
Set-Location $repoPath
Write-OK "Repertoire courant : $(Get-Location)"

# -- 1. Verification du remote --------------------------------
Write-Header "1 - Verification du remote"
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Fail "Aucun remote 'origin' trouve. Mauvais depot ?"
}
Write-OK "Remote origin : $remoteUrl"

if ($remoteUrl -notmatch 'idae') {
    Write-Warn "Le remote ne semble pas etre le repo 'idae' ($remoteUrl)."
    $confirm = Read-Host "  Continuer quand meme ? (oui / non)"
    if ($confirm -ne 'oui') { Write-Fail "Operation annulee par l'utilisateur." }
}

# -- 2. Verifier qu'on est sur dev ---------------------------
Write-Header "2 - Branche courante"
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne 'dev') {
    Write-Warn "Branche courante : '$currentBranch' (attendu : 'dev')"
    $confirm = Read-Host "  Basculer sur 'dev' automatiquement ? (oui / non)"
    if ($confirm -eq 'oui') {
        git checkout dev
        $currentBranch = git rev-parse --abbrev-ref HEAD
    } else {
        Write-Fail "Operation annulee. Basculez manuellement sur 'dev'."
    }
}
Write-OK "Branche active : $currentBranch"

# -- 3. Creer une branche de backup --------------------------
Write-Header "3 - Backup"
$today      = Get-Date -Format 'yyyyMMdd'
$backupName = "dev-backup-$today"

$existing = git branch --list $backupName
if ($existing) {
    Write-Warn "La branche '$backupName' existe deja. Backup ignore."
} else {
    git branch $backupName
    Write-OK "Branche de backup creee : $backupName"
}

# -- 4. Audit BOM avant reset ---------------------------------
Write-Header "4 - Audit BOM avant reset"
$goodCommit = '8e01f4ff'

$bomBefore = @(
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
$bomCountBefore = $bomBefore.Count
Write-OK "Fichiers BOM-only detectes avant reset : $bomCountBefore"

# -- 5. Reset hard -------------------------------------------
Write-Header "5 - Reset --hard vers $goodCommit"
git reset --hard $goodCommit
Write-OK "Reset effectue."

# -- 6. Verification post-reset ------------------------------
Write-Header "6 - Audit BOM apres reset"
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
    Write-Warn "$bomCountAfter fichier(s) BOM-only encore presents :"
    $bomAfter | ForEach-Object { Write-Host "      $_" -ForegroundColor Yellow }
}

# -- 7. Resume -----------------------------------------------
Write-Header "7 - Resume"
$headNow    = git rev-parse --short HEAD
$headMsg    = git log -1 --pretty=format:'%s'
$filesNow   = (git ls-files | Measure-Object).Count

Write-Host ""
Write-Host "  Repo         : $repoPath"               -ForegroundColor White
Write-Host "  Branche      : $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor White
Write-Host "  HEAD         : $headNow  -  $headMsg"   -ForegroundColor White
Write-Host "  Fichiers     : $filesNow fichiers trackes" -ForegroundColor White
Write-Host "  BOM supprimes: $($bomCountBefore - $bomCountAfter) / $bomCountBefore" -ForegroundColor White
Write-Host "  Backup       : $backupName"              -ForegroundColor White
Write-Host ""

# -- 8. Push (non automatique) --------------------------------
Write-Header "8 - Push"
Write-Warn "Push non effectue automatiquement."
Write-Host "     Pour forcer : git push --force origin dev" -ForegroundColor Gray
Write-Host "     Pour backup : git push origin $backupName"  -ForegroundColor Gray

Write-Host ""
Write-OK "Script termine."
