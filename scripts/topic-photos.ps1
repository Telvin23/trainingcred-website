# Fills src\assets\topics with 2 photos for each of the 169 course topics (scripts\topic-photos.json).
# Courses imported from trainingcred.com use their topic's photo unless they have their own in src\assets\courses.
# Openverse first (free licences: CC0, public domain, CC BY), Wikimedia Commons as fallback.
# Safe to run again: topics that already have their photos are skipped. Credits go to image-credits.csv.
& {
  $ProgressPreference = 'SilentlyContinue'
  $proj = Split-Path -Parent $PSScriptRoot
  $dir  = Join-Path $proj 'src\assets\topics'
  $csv  = Join-Path $proj 'image-credits.csv'
  $PER_TOPIC = 2
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  Add-Type -AssemblyName System.Drawing
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $ua = @{ 'User-Agent' = 'WeSkillSitePhotos/1.0 (training website topic photos)' }
  $topics = Get-Content (Join-Path $proj 'scripts\topic-photos.json') -Raw | ConvertFrom-Json

  $script:ovBlocked = $false
  function Get-Json($u) {
    for ($i = 1; $i -le 3; $i++) {
      try { return Invoke-RestMethod -Uri $u -Headers $ua -TimeoutSec 45 }
      catch {
        $code = $null; try { $code = [int]$_.Exception.Response.StatusCode } catch { }
        if ($code -eq 429 -and $u -like '*openverse*') {
          if (-not $script:ovBlocked) { Write-Host '   Openverse daily limit reached - using Wikimedia Commons only for the rest of this run' -ForegroundColor Yellow }
          $script:ovBlocked = $true; return $null
        }
        Start-Sleep -Seconds (4 * $i)
      }
    }
    return $null
  }
  function Save-Photo($src, $out) {
    $tmp = Join-Path $env:TEMP ('topic-' + [guid]::NewGuid() + '.tmp')
    try {
      Invoke-WebRequest -Uri $src -OutFile $tmp -Headers $ua -TimeoutSec 90
      $img = [System.Drawing.Image]::FromFile($tmp)
      if ($img.Width -lt 700 -or $img.Height -lt 450 -or $img.Height -gt $img.Width * 1.4) { $img.Dispose(); return $false }
      $scale = [Math]::Min(1, 1000 / $img.Width)
      $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
      $bmp = New-Object System.Drawing.Bitmap $w, $h
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = 'HighQualityBicubic'; $g.DrawImage($img, 0, 0, $w, $h)
      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 78L
      $bmp.Save($out, $codec, $ep)
      $g.Dispose(); $bmp.Dispose(); $img.Dispose()
      return $true
    } catch { return $false }
    finally { if (Test-Path $tmp) { Remove-Item $tmp -Force -ErrorAction SilentlyContinue } }
  }

  $used = @{}
  if (Test-Path $csv) { Import-Csv $csv | ForEach-Object { $used[$_.source_id] = 1 } }
  $added = 0; $short = @(); $n = 0
  foreach ($t in $topics) {
    $n++
    $have = @(Get-ChildItem $dir -Filter "$($t.slug)--*.jpg" -ErrorAction SilentlyContinue).Count
    if ($have -ge $PER_TOPIC) { continue }
    Write-Host ("[{0}/{1}] {2}" -f $n, $topics.Count, $t.topic)
    $next = $have + 1
    foreach ($q in $t.queries) {
      if ($next -gt $PER_TOPIC) { break }
      # 1) Openverse
      $res = $null
      if (-not $script:ovBlocked) { Start-Sleep -Milliseconds 1500; $res = Get-Json ('https://api.openverse.org/v1/images/?q=' + [uri]::EscapeDataString($q) + '&license=cc0,pdm,by&size=large&mature=false&page_size=20') }
      $cands = @()
      if ($res) { $cands += $res.results | Sort-Object @{ Expression = { if ($_.license -in 'cc0', 'pdm') { 0 } else { 1 } } } | ForEach-Object { [pscustomobject]@{ id = $_.id; url = $_.url; license = $_.license; creator = $_.creator; landing = $_.foreign_landing_url; attribution = $_.attribution } } }
      # 2) Wikimedia Commons
      if ($cands.Count -lt 5) {
        $c = Get-Json ('https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=30&gsrsearch=' + [uri]::EscapeDataString("$q filetype:bitmap") + '&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1200')
        if ($c -and $c.query) {
          foreach ($p in ($c.query.pages.PSObject.Properties.Value | Sort-Object index)) {
            $ii = $p.imageinfo[0]
            if ($ii.mime -ne 'image/jpeg' -or $p.title -match 'map|flag|logo|seal|diagram|svg|chart') { continue }
            $m = $ii.extmetadata
            $artist = if ($m.Artist) { ($m.Artist.value -replace '<[^>]+>', '').Trim() } else { 'Unknown' }
            $lic = if ($m.LicenseShortName) { $m.LicenseShortName.value } else { 'see source' }
            $cands += [pscustomobject]@{ id = $p.title; url = $ii.thumburl; license = $lic; creator = $artist; landing = $ii.descriptionurl; attribution = "$($p.title -replace '^File:','') by $artist, $lic, via Wikimedia Commons" }
          }
        }
      }
      foreach ($r in $cands) {
        if ($next -gt $PER_TOPIC) { break }
        if ($used[$r.id]) { continue }
        $out = Join-Path $dir "$($t.slug)--$next.jpg"
        if (Save-Photo $r.url $out) {
          $used[$r.id] = 1
          [pscustomobject]@{ slug = "topic-$($t.slug)--$next"; title = $t.topic; query = $q; source_id = $r.id; license = $r.license; creator = $r.creator; landing_url = $r.landing; attribution = $r.attribution } |
            Export-Csv -Path $csv -Append -NoTypeInformation -Encoding UTF8
          Write-Host "   added $($t.slug)--$next ($($r.license))" -ForegroundColor Green
          $added++; $next++
        }
      }
    }
    if ($next -le $PER_TOPIC) { $short += $t.topic }
  }
  Write-Host ""
  Write-Host "$added topic photos added to src\assets\topics" -ForegroundColor Cyan
  $none = @($topics | Where-Object { @(Get-ChildItem $dir -Filter "$($_.slug)--*.jpg" -ErrorAction SilentlyContinue).Count -eq 0 } | ForEach-Object { $_.topic })
  Write-Host ("Topics with 2 photos: " + ($topics.Count - $short.Count) + " | with 1 photo: " + ($short.Count - $none.Count) + " | with none: " + $none.Count) -ForegroundColor Cyan
  if ($none.Count) { Write-Host "Topics with no photo yet (their courses borrow a photo from the same focus area):" -ForegroundColor Yellow; $none | ForEach-Object { Write-Host "   $_" } }
}
