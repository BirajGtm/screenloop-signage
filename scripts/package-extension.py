"""Create the Chrome Web Store upload from extension runtime files."""
import argparse
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / 'chrome-extension'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--tag')
args = parser.parse_args()
manifest = json.loads((source / 'manifest.json').read_text())
version = manifest['version']
if args.tag and args.tag != 'v' + version:
    raise SystemExit('Version tag must match manifest: v' + version)
files = [p for p in sorted(source.rglob('*')) if p.is_file() and not any(x.startswith('.') for x in p.relative_to(source).parts) and p.suffix in {'.js', '.json', '.html', '.css', '.png'}]
if any(p.is_symlink() for p in files):
    raise SystemExit('Symlinks are not allowed')
names = {p.relative_to(source).as_posix() for p in files}
for name in ['manifest.json', manifest['background']['service_worker'], manifest['action']['default_popup'], manifest['options_page'], *manifest['icons'].values()]:
    if name not in names:
        raise SystemExit('Missing required file: ' + name)
out = root / 'dist'
out.mkdir(exist_ok=True)
archive = out / ('screenloop-signage-' + version + '.zip')
with ZipFile(archive, 'w', ZIP_DEFLATED) as zipped:
    for path in files:
        zipped.write(path, path.relative_to(source))
with ZipFile(archive) as zipped:
    assert zipped.testzip() is None
    assert 'manifest.json' in zipped.namelist()
    assert json.loads(zipped.read('manifest.json')) == manifest
print(archive)
