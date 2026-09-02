// src/utils/physicsEngine.js

export const calculateMetrics = (state) => {
  let weight = 120; // base structure

  // Chassis
  if (state.chassis === "tubular") weight += 26;
  else if (state.chassis === "monocoque") weight += 18;

  // Motor (Electric motors are much lighter than combustion engine block + fuel tank!)
  if (state.motor === "amk_4wd") weight += 30;
  else if (state.motor === "amk_2wd") weight += 15;
  else if (state.motor === "emrax_rwd") weight += 25;

  // Tires
  if (state.tires === "avon") weight += 15.2;
  else if (state.tires === "hoosier") weight += 14.4;
  else if (state.tires === "pirelli") weight += 16.0;

  // Battery
  if (state.battery === "kokam") weight += 24;
  else if (state.battery === "molicel") weight += 18;

  // Seat
  if (state.seat === "carbon") weight += 3.2;
  else weight += 4.8;

  // Steering
  if (state.steering === "pro") weight += 1.8;
  else weight += 1.2;

  // Aero parts
  if (state.frontWing === 'high') weight += 3.0;
  else if (state.frontWing === 'low') weight += 1.5;

  if (state.rearWing === 'high') weight += 2.5;
  else if (state.rearWing === 'low') weight += 1.5;

  if (state.sidepod) weight += 2.5;

  const weightSub = state.chassis === "monocoque" ? "Carbon Monocoque" : "Tubular Steel Chassis";

  let power = 107;
  let engineSub = "AMK DD5 (4WD)";
  if (state.motor === "amk_4wd") {
    power = 107;
    engineSub = "AMK DD5 (4WD)";
  } else if (state.motor === "amk_2wd") {
    power = 94;
    engineSub = "AMK DD5 (2WD)";
  } else if (state.motor === "emrax_rwd") {
    power = 107;
    engineSub = "Emrax 228 (RWD)";
  }
  
  // Battery power boost
  if (state.battery === "kokam") {
    power += 8;
  }

  // ACCELERATION
  let accel = 3.5;
  if (state.motor === "amk_4wd") {
    accel = 1.95; // 4WD Torque Vectoring
  } else if (state.motor === "amk_2wd") {
    accel = 2.25; // 2WD dual-motor traction control
  } else if (state.motor === "emrax_rwd") {
    accel = 2.45; // Single motor differential
  }

  // Weight penalty/benefit (Standard weight is ~220 kg)
  accel += (weight - 220) * 0.005;

  // Tires effect
  if (state.tires === "hoosier") accel -= 0.12;
  else if (state.tires === "avon") accel -= 0.06;

  // Aero downforce effect on acceleration
  if (state.frontWing === 'high') accel -= 0.05;
  else if (state.frontWing === 'low') accel -= 0.02;

  if (state.rearWing === 'high') accel -= 0.05;
  else if (state.rearWing === 'low') accel -= 0.02;

  // Battery discharge effect
  if (state.battery === "kokam") accel -= 0.08;

  // Clamp values beautifully
  accel = Math.max(1.50, Math.min(2.90, accel));

  return {
    weight: weight.toFixed(1) + " kg",
    weightSub,
    power: power + " HP",
    engineSub,
    accel: accel.toFixed(2) + " s",
    accelSub: "0 – 100 km/h"
  };
};
