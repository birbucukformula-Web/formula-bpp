const AVAILABLE_FILES = [
  'black-base-lowfront-lowrear.png',
  'red-base-highfront-lowrear.png',
  'red-base-lowfront-highrear.png',
  'red-base-lowfront-lowrear.png'
];
const state = { color: 'red', jant: 'base', frontWing: 'low', rearWing: 'low', sidepod: false };

const match = AVAILABLE_FILES.find(file => {
  const lower = file.toLowerCase();
  
  if (!lower.includes(state.color || 'white')) return false;
  if (!lower.includes((!state.jant || state.jant === 'none') ? 'base' : state.jant)) return false;
  
  const hasSidepod = !!state.sidepod;
  const hasFront = state.frontWing && state.frontWing !== 'none';
  const hasRear = state.rearWing && state.rearWing !== 'none';
  
  if (hasSidepod && !lower.includes('sidepod')) return false;
  if (!hasSidepod && lower.includes('sidepod')) return false;
  
  if (hasFront) {
    const kw1 = state.frontWing + 'front';
    const kw2 = state.frontWing + '-front';
    const kw3 = 'front-' + state.frontWing;
    if (!lower.includes(kw1) && !lower.includes(kw2) && !lower.includes(kw3)) return false;
  } else {
    if (lower.includes('front')) return false;
  }
  
  if (hasRear) {
    const kw1 = state.rearWing + 'rear';
    const kw2 = state.rearWing + '-rear';
    const kw3 = 'rear-' + state.rearWing;
    if (!lower.includes(kw1) && !lower.includes(kw2) && !lower.includes(kw3)) return false;
  } else {
    if (lower.includes('rear')) return false;
  }
  
  if (!hasSidepod && !hasFront && !hasRear) {
    if (!lower.includes('bare') && !lower.includes('car')) return false;
  }
  
  return true;
});

console.log('MATCHED:', match);
