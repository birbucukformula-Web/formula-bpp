const file = 'red-base-highfront-lowrear.png';
const state = { color: 'red', jant: 'base', frontWing: 'low', rearWing: 'low', sidepod: false };
const lower = file.toLowerCase();

let result = 'passed';
const hasFront = true;
const hasRear = true;

if (hasFront) {
  const kw1 = state.frontWing + 'front';
  const kw2 = state.frontWing + '-front';
  const kw3 = 'front-' + state.frontWing;
  if (!lower.includes(kw1) && !lower.includes(kw2) && !lower.includes(kw3)) {
    result = 'failed at front';
  }
}

console.log(result);
