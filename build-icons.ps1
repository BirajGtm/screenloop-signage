# Generate the packaged icon sizes from the untouched original.
Add-Type -AssemblyName System.Drawing
$sourcePath = Join-Path $PSScriptRoot 'Logo Main.png'
$iconRoot = Join-Path $PSScriptRoot 'chrome-extension/icons'
$source = [System.Drawing.Image]::FromFile($sourcePath)
try {
  foreach ($size in @(16,32,48,128)) {
    $bitmap = New-Object System.Drawing.Bitmap($size,$size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($source,0,0,$size,$size)
      $bitmap.Save((Join-Path $iconRoot "$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $graphics.Dispose(); $bitmap.Dispose() }
  }
} finally { $source.Dispose() }
