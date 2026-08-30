const fs = require('fs');

const AVAILABLE_FILES = [
  "black-base-car.jpeg", "black-base-high-front.png", "black-base-high-sidepod.png", "black-base-low-front.jpeg", "black-base-low-rear.jpeg", "black-base-low-sidepod.png", "black-base-sidepod.jpeg", "black-base-sidepod.png", "black-braid-bare.jpg", "black-braid-high-front.png", "black-braid-high-sidepod.png", "black-braid-low-front.png", "black-braid-low-sidepod.png", "black-oz-bare.jpg", "black-oz-high-front.png", "black-oz-low-front.png", "red-bare-highfront-lowrear.png", "red-base-car.jpeg", "red-base-high-sidepod.png", "red-base-idepod.jpeg", "red-base-low-front.jpeg", "red-base-low-rear.jpeg", "red-base-low-sidepod.png", "red-base-sidepod.png", "red-braid-bare.jpg", "red-braid-high-front.png", "red-braid-high-sidepod.png", "red-braid-low-front.png", "red-braid-low-sidepod.png", "red-oz-bare.jpg", "red-oz-high-front.png", "red-oz-low-front.png", "white-base-car.jpeg", "white-base-high-front.png", "white-base-high-rear.jpeg", "white-base-high-sidepod.png", "white-base-low-front.jpeg", "white-base-low-rear.jpeg", "white-base-low-sidepod.png", "white-base-sidepod.jpeg", "white-braid-bare.jpg", "white-braid-front-high.png", "white-braid-front-low.png", "white-braid-high-front.png", "white-braid-high-sidepod.png", "white-braid-low-front.png", "white-braid-low-sidepod.png", "white-braid-sidepod.png", "white-car.jpeg", "white-oz-bare.jpg", "white-oz-high-front.jpg", "white-oz-high-sidepod.png", "white-oz-high.png", "white-oz-low-front.png", "white-oz-low-sidepod.png", "white-oz-low.png", "white-oz-sidepod.png"
];

const colors = ['white', 'black', 'red'];
const jants = ['base', 'oz', 'braid'];
const sidepods = [false, true];
const frontWings = ['none', 'low', 'high'];
const rearWings = ['none', 'low', 'high'];

const missing = [];

for (const color of colors) {
  for (const jant of jants) {
    for (const sidepod of sidepods) {
      for (const frontWing of frontWings) {
        for (const rearWing of rearWings) {
          
          let requiredKeywords = [color, jant];
          if (sidepod) requiredKeywords.push('sidepod');
          
          const hasFront = frontWing !== 'none';
          const hasRear = rearWing !== 'none';
          
          if (hasFront) {
            requiredKeywords.push(frontWing);
          }
          if (hasRear) {
            requiredKeywords.push(rearWing);
            requiredKeywords.push('rear');
          }
          
          if (!sidepod && !hasFront && !hasRear) {
            if (jant === 'base') requiredKeywords.push('car');
            else requiredKeywords.push('bare');
          }
          
          const match = AVAILABLE_FILES.find(file => {
            const lowerFile = file.toLowerCase();
            return requiredKeywords.every(kw => lowerFile.includes(kw));
          });
          
          if (!match) {
            missing.push({
              color, jant, sidepod, frontWing, rearWing, requiredKeywords
            });
          }
        }
      }
    }
  }
}

console.log("Missing count:", missing.length);
fs.writeFileSync('missing.json', JSON.stringify(missing, null, 2));
