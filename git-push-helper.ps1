# Git Push Helper Script
# This script helps prevent pushing to the wrong remote

# Check if we're in a Git repository
if (!(Test-Path ".git")) {
    Write-Host "Error: Not in a Git repository" -ForegroundColor Red
    exit 1
}

# Get current branch
$currentBranch = git branch --show-current

# Check remotes
$remotes = git remote -v
$hasFork = $remotes -match "fork"
$hasOrigin = $remotes -match "origin"

Write-Host "Current branch: $currentBranch" -ForegroundColor Green
Write-Host "Available remotes:" -ForegroundColor Yellow
git remote -v

# Determine the correct remote to push to
if ($hasFork) {
    $pushRemote = "fork"
    Write-Host "`nRecommended: Push to 'fork' remote (your personal repository)" -ForegroundColor Green
    Write-Host "Command: git push -u fork $currentBranch" -ForegroundColor Cyan
} else {
    $pushRemote = "origin"
    Write-Host "`nWarning: No 'fork' remote found. Pushing to 'origin'" -ForegroundColor Yellow
    Write-Host "Command: git push -u origin $currentBranch" -ForegroundColor Cyan
}

# Ask for confirmation
$confirm = Read-Host "`nDo you want to push to '$pushRemote'? (y/n)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    Write-Host "Pushing to $pushRemote..." -ForegroundColor Green
    git push -u $pushRemote $currentBranch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push successful!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Yellow
        Write-Host "1. Go to your GitHub repository" -ForegroundColor White
        Write-Host "2. Create a Pull Request to the main repository" -ForegroundColor White
        Write-Host "3. Reference the issue number in your PR" -ForegroundColor White
    } else {
        Write-Host "Push failed. Check your authentication." -ForegroundColor Red
    }
} else {
    Write-Host "Push cancelled." -ForegroundColor Yellow
}
