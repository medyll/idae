# fix-context-mode-hook.ps1
# Ajoute une guard "VS Code uniquement" aux hooks context-mode dans Claude Code settings.json
# Usage : clic-droit > "Exécuter avec PowerShell"  (ou : pwsh fix-context-mode-hook.ps1)

$settingsPath = "$env:USERPROFILE\.claude\settings.json"

if (-not (Test-Path $settingsPath)) {
    Write-Host "ERREUR : $settingsPath introuvable." -ForegroundColor Red
    exit 1
}

# Sauvegarde
$backup = "$settingsPath.bak_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item $settingsPath $backup
Write-Host "Sauvegarde : $backup" -ForegroundColor Cyan

$raw  = Get-Content $settingsPath -Raw -Encoding UTF8
$json = $raw | ConvertFrom-Json

# La guard PowerShell : ne lance context-mode que si VS Code est actif
# VSCODE_IPC_HOOK_CLI est injecte par VS Code dans ses terminaux integres
$guardPrefix = 'if ($env:VSCODE_IPC_HOOK_CLI) { '
$guardSuffix = ' }'

function Add-Guard($cmd) {
    # Evite de doubler la guard si deja presente
    if ($cmd -like "*VSCODE_IPC_HOOK_CLI*") { return $cmd }
    return "$guardPrefix$cmd$guardSuffix"
}

$hookEvents = @("PreToolUse", "PostToolUse", "SessionStart", "Stop")
$patched = 0

foreach ($event in $hookEvents) {
    if ($json.hooks.$event) {
        for ($i = 0; $i -lt $json.hooks.$event.Count; $i++) {
            $hook = $json.hooks.$event[$i]
            if ($hook.command -like "*context-mode*") {
                $original = $hook.command
                $json.hooks.$event[$i].command = Add-Guard $original
                Write-Host "[$event] Patche : $original" -ForegroundColor Yellow
                $patched++
            }
        }
    }
}

if ($patched -eq 0) {
    Write-Host "Aucun hook context-mode trouve dans $settingsPath" -ForegroundColor Yellow
    Write-Host "Verifie manuellement le fichier." -ForegroundColor Yellow
} else {
    $json | ConvertTo-Json -Depth 20 | Set-Content $settingsPath -Encoding UTF8
    Write-Host "`n$patched hook(s) patche(s) avec succes." -ForegroundColor Green
    Write-Host "Redemarrer Claude Code pour appliquer." -ForegroundColor Green
}
