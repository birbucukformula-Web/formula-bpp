const fs = require('fs');
const path = require('path');

const carsDir = path.join(__dirname, '../public/assets/cars');
const outputFilePath = path.join(__dirname, '../src/data/carsList.json');

try {
  const files = fs.readdirSync(carsDir)
    .filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

  fs.writeFileSync(outputFilePath, JSON.stringify(files, null, 2));
  console.log(`Successfully generated carsList.json with ${files.length} items.`);
} catch (error) {
  console.error('Error generating cars list:', error);
  process.exit(1);
}
