Remove-Item ..\dist\*

node r.js -o build_js.js
node r.js -o build_css.js

$js_hash = (Get-FileHash ..\dist\main-built.js -Algorithm md5).hash
$css_hash = (Get-FileHash ..\dist\style.min.css -Algorithm md5).hash

Rename-Item ..\dist\main-built.js main-built-$js_hash.js
Rename-Item ..\dist\style.min.css style.$css_hash.min.css
