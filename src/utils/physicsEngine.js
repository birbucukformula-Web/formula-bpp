// src/utils/physicsEngine.js
import { BASE_WEIGHT, PHYSICS_DATA } from "../data/physicsData";

export const calculateMetrics = (state) => {
  let weight = BASE_WEIGHT;
  let power = 0;
  
  // Safe accessor
  const getProp = (category, key) => {
    if (!PHYSICS_DATA[category]) return PHYSICS_DATA[category]?.default || {};
    // Handle booleans (like sidepod)
    const normalizedKey = typeof key === 'boolean' ? String(key) : (key || "none");
    return PHYSICS_DATA[category][normalizedKey] || PHYSICS_DATA[category]?.default || {};
  };

  // 1. Weight Calculations
  weight += getProp("chassis", state.chassis).weight || 0;
  weight += getProp("motor", state.motor).weight || 0;
  weight += getProp("tires", state.tires).weight || 0;
  weight += getProp("battery", state.battery).weight || 0;
  weight += getProp("seat", state.seat).weight || 0;
  weight += getProp("steering", state.steering).weight || 0;
  weight += getProp("frontWing", state.frontWing).weight || 0;
  weight += getProp("rearWing", state.rearWing).weight || 0;
  weight += getProp("sidepod", state.sidepod).weight || 0;

  // 2. Power Calculations
  const motorData = getProp("motor", state.motor);
  power = motorData.power || 0;

  // 3. Acceleration Calculations (0-100 km/h)
  // Total mass includes a typical 68kg FS driver
  const totalMass = weight + 68; 
  
  // Base ideal acceleration time based on power-to-weight ratio (HP / kg)
  // Example: 107 HP / 270 kg = 0.396 HP/kg
  const pwrRatio = power / totalMass; 
  
  // Empirical base time in a vacuum without grip limits
  let accelTime = (1 / pwrRatio) * 0.75; 
  
  // FSE acceleration is primarily grip-limited
  const drivetrainGrip = motorData.gripFactor || 0.5; // AWD (1.0) vs RWD (0.7)
  const tireGrip = getProp("tires", state.tires).gripBoost || 0;
  const batteryGrip = getProp("battery", state.battery).gripBoost || 0; // e.g. lower CoG
  
  // Downforce adds virtual weight, increasing grip (crucial for AWD launch)
  const aeroGrip = (getProp("frontWing", state.frontWing).aeroGrip || 0) + 
                   (getProp("rearWing", state.rearWing).aeroGrip || 0);

  const totalGrip = drivetrainGrip + tireGrip + batteryGrip + aeroGrip;
  
  // Apply grip limitation penalty
  accelTime = accelTime / Math.pow(totalGrip, 0.85);

  // Clamp values realistically for Formula Student
  accelTime = Math.max(1.45, Math.min(4.50, accelTime));

  return {
    weight: weight.toFixed(1) + " kg",
    weightSub: getProp("chassis", state.chassis).name || "Unknown Chassis",
    power: power + " HP",
    engineSub: motorData.name || "Unknown Motor",
    accel: accelTime.toFixed(2) + " s",
    accelSub: "0 – 100 km/h"
  };
};
