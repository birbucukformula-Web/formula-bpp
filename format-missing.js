const fs = require('fs');
const missing = JSON.parse(fs.readFileSync('missing.json'));

const markdown = ['# Eksik Görseller Listesi', '', 'Şu anda sistemde 162 olası kombinasyonun 106 tanesine ait görsel eksik. Görselleri klasöre eklerken aşağıdaki isim formatlarını (veya bu kelimeleri içerecek şekilde) kullanmanız gerekiyor.', ''];

const byColor = missing.reduce((acc, curr) => {
  acc[curr.color] = acc[curr.color] || [];
  acc[curr.color].push(curr.requiredKeywords.join('-'));
  return acc;
}, {});

for (const [color, items] of Object.entries(byColor)) {
  markdown.push(`## ${color.toUpperCase()} Renk Eksikleri`);
  items.forEach(item => markdown.push(`- \`${item}.png/jpeg\``));
  markdown.push('');
}

fs.writeFileSync('C:/Users/Rumeysa/.gemini/antigravity-ide/brain/40625812-a8da-4f67-b087-a464f76713c2/missing_combinations.md', markdown.join('\n'));
