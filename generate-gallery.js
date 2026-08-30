const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/assets/bpp-gorsel');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg')).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #222; color: #fff; margin: 0; padding: 10px; }
    .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .item { border: 1px solid #444; background: #333; text-align: center; }
    img { width: 100%; height: auto; display: block; }
    div { padding: 5px; font-size: 14px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="gallery">
    ${files.map(f => `
      <div class="item">
        <img src="/assets/bpp-gorsel/${encodeURIComponent(f)}" />
        <div>${f}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'public/gallery.html'), html);
console.log('Gallery generated at public/gallery.html');
