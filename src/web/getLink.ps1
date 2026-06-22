$logLocation = "%userprofile%\AppData\LocalLow\miHoYo\Zenless Zone Zero\output_log.txt";
$logLocationChina = "%userprofile%\AppData\LocalLow\miHoYo\$([char]0x7edd)$([char]0x533a)$([char]0x96f6)\output_log.txt";

$reg = $args[0]
if ($reg -eq "china") {
  Write-Host "Using China cache location"
  $logLocation = $logLocationChina
}

$tmps = $env:TEMP + '\pm.ps1';
if ([System.IO.File]::Exists($tmps)) {
  ri $tmps
}

$path = [System.Environment]::ExpandEnvironmentVariables($logLocation);
if (-Not [System.IO.File]::Exists($path)) {
    Write-Host "Cannot find the log file! Make sure to open the signal history first!" -ForegroundColor Red

    if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Host "Do you want to try to run the script as Administrator? Press [ENTER] to continue, or any key to cancel."
        $keyInput = [Console]::ReadKey($true).Key
        if ($keyInput -ne "13") {
            return
        }

        $myinvocation.mycommand.definition > $tmps

        Start-Process powershell -Verb runAs -ArgumentList "-noexit", $tmps, $reg
        break
    }

    return
}

$logs = Get-Content -Path $path
$m = $logs -match "(?m).:/.+(ZenlessZoneZero_Data)"
$m[0] -match "(.:/.+(ZenlessZoneZero_Data))" >$null

if ($matches.Length -eq 0) {
    Write-Host "Cannot find the signal history url! Make sure to open the signal history first!" -ForegroundColor Red
    return
}

$gamedir = $matches[1]
$cachefile = "$gamedir/webCaches/Cache/Cache_Data/data_2"
$tmpfile = "$env:TEMP/ch_data_2"

Copy-Item $cachefile -Destination $tmpfile

$content = Get-Content -Encoding UTF8 -Raw $tmpfile
$splitted = $content -split "1/0/"
$found = $splitted -match "https.+?game_biz=nap.+?&"

$found = $found[$found.Length - 1] -match "(https.+?game_biz=nap.+?)&"

Remove-Item $tmpfile

if (-Not $found) {
  Write-Host "Cannot find the signal history url! Make sure to open the signal history first!" -ForegroundColor Red
  return
}

$signalHistoryUrl = $matches[1]

Write-Host $signalHistoryUrl
Set-Clipboard -Value $signalHistoryUrl
Write-Host "Link copied to clipboard" -ForegroundColor Green
if ($reg -eq "china") {
  Write-Host "URL$([char]0x5df2)$([char]0x7ecf)$([char]0x590d)$([char]0x5236)$([char]0x5230)$([char]0x7c98)$([char]0x8d34)$([char]0x677f)"
}
