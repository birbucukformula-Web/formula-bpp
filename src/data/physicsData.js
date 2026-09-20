export const BASE_WEIGHT = 110; // Base un-sprung structure & components in kg

export const PHYSICS_DATA = {
  chassis: {
    tubular: { weight: 32, name: "Tubular Steel Chassis" },
    monocoque: { weight: 18, name: "Carbon Monocoque" },
    default: { weight: 0, name: "Unknown Chassis" }
  },
  motor: {
    amk_4wd: { weight: 24, power: 107, gripFactor: 1.0, name: "AMK DD5 (4WD)" },
    amk_2wd: { weight: 14, power: 94, gripFactor: 0.75, name: "AMK DD5 (2WD)" },
    emrax_rwd: { weight: 28, power: 107, gripFactor: 0.7, name: "Emrax 228 (RWD)" },
    default: { weight: 0, power: 107, gripFactor: 0.5, name: "Unknown Motor" }
  },
  tires: {
    avon: { weight: 15.2, gripBoost: 0.05 },
    hoosier: { weight: 14.4, gripBoost: 0.10 },
    pirelli: { weight: 16.0, gripBoost: 0.0 }
  },
  battery: {
    kokam: { weight: 52, gripBoost: 0.05 },
    molicel: { weight: 45, gripBoost: 0.0 }
  },
  seat: {
    carbon: { weight: 3.2 },
    default: { weight: 4.8 }
  },
  steering: {
    pro: { weight: 1.8 },
    default: { weight: 1.2 }
  },
  frontWing: {
    high: { weight: 5.0, aeroGrip: 0.08 },
    low: { weight: 3.0, aeroGrip: 0.03 },
    none: { weight: 0, aeroGrip: 0.0 }
  },
  rearWing: {
    high: { weight: 4.0, aeroGrip: 0.08 },
    low: { weight: 2.5, aeroGrip: 0.03 },
    none: { weight: 0, aeroGrip: 0.0 }
  },
  sidepod: {
    true: { weight: 2.5 },
    false: { weight: 0 }
  }
};
