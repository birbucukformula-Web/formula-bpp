// src/data/config.js

export const MODELS = [
  { id: "FS-26", label: "FS-26", year: "2026" },
];

export const COLORS = [
  { id: "white", label: "Pure White",  hex: "#F0F0F0" },
  { id: "black", label: "Onyx Black",  hex: "#111111" },
  { id: "red",   label: "Racing Red",  hex: "#C0001A" },
];

export const SECTIONS = [
  // ── EXTERIOR ──────────────────────────────────────────────
  {
    id: "color",
    label: "Colour",
    icon: "◐",
    changeable: true,
    type: "color",
    group: "Exterior",
  },
  {
    id: "wheels",
    label: "Wheels",
    icon: "◎",
    changeable: true,
    type: "option",
    group: "Exterior",
    options: [
      { id: "oz",    label: "OZ Racing", sub: "Multi-spoke Black · 4.6 kg" },
      { id: "braid", label: "Braid",     sub: "Silver Alloy · 4.0 kg" },
    ],
    default: null, // nothing pre-selected
  },
  {
    id: "aero",
    label: "Aero Package",
    icon: "⟿",
    changeable: true,
    type: "aero-toggle",
    group: "Exterior",
    // highWing, lowWing, sidepod are each toggled independently
  },

  // ── INTERIOR ──────────────────────────────────────────────
  {
    id: "seat",
    label: "Seat",
    icon: "▣",
    changeable: true,
    type: "option",
    group: "Interior",
    options: [
      { id: "standard", label: "Standard",     sub: "Composite Suede · 4.8 kg" },
      { id: "carbon",   label: "Carbon Fibre", sub: "FIA homologated · 3.2 kg" },
    ],
    default: "carbon",
  },
  {
    id: "steering",
    label: "Steering Wheel",
    icon: "⊙",
    changeable: true,
    type: "option",
    group: "Interior",
    options: [
      { id: "basic", label: "Basic Steel",    sub: "Classic · 280 mm" },
      { id: "pro",   label: "Pro / Display",  sub: "Integrated display · 280 mm" },
    ],
    default: "pro",
  },

  // ── SPECS ───────────────────────────────────────────
  {
    id: "tires",
    label: "Tyres",
    icon: "◉",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "avon",    label: "Avon 6.0/20.0-13", sub: "Soft Compound · 3.8 kg" },
      { id: "hoosier", label: "Hoosier R25B",      sub: "Super-Soft Compound · 3.6 kg" },
      { id: "pirelli", label: "Pirelli FS",        sub: "Medium Compound · 4.0 kg" },
    ],
    default: "avon",
  },
  {
    id: "suspension",
    label: "Suspension",
    icon: "⌇",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "double_wishbone", label: "Double Wishbone",    sub: "Öhlins TTX25 Damper" },
      { id: "pushrod",         label: "Pushrod Suspension", sub: "Penske 8760 Damper" },
    ],
    default: "double_wishbone",
  },
  {
    id: "motor",
    label: "Motor",
    icon: "⚙",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "amk_4wd",   label: "AMK DD5 (4WD)",    sub: "4 × In-wheel Motors · 107 HP" },
      { id: "amk_2wd",   label: "AMK DD5 (2WD)",    sub: "2 × In-wheel Motors · 94 HP" },
      { id: "emrax_rwd", label: "Emrax 228 (RWD)",  sub: "Axial Flux Motor · 107 HP" },
    ],
    default: "amk_4wd",
  },
  {
    id: "brakes",
    label: "Brakes",
    icon: "⎔",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "brembo",    label: "Brembo Performance", sub: "4-piston Caliper" },
      { id: "ap_racing", label: "AP Racing FS",       sub: "Lightweight Alloy Caliper" },
      { id: "wilwood",   label: "Wilwood GP320",      sub: "Steel Disc" },
    ],
    default: "brembo",
  },
  {
    id: "chassis",
    label: "Chassis",
    icon: "⛨",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "tubular",   label: "Tubular Spaceframe", sub: "Chromoly Steel · 26 kg" },
      { id: "monocoque", label: "Carbon Monocoque",   sub: "Carbon Monocoque · 18 kg" },
    ],
    default: "tubular",
  },
  {
    id: "battery",
    label: "Battery",
    icon: "🔋",
    changeable: true,
    type: "option",
    group: "Specs",
    options: [
      { id: "molicel", label: "Molicel INR21700-P42A", sub: "21700 Silindirik · 45A" },
      { id: "kokam",   label: "Kokam SLPB Serisi",     sub: "Pouch · Yüksek Güç" },
    ],
    default: "molicel",
  },
];

export const DEFAULT_STATE = {
  model: "FS-26",
  color: "white",
  wheels: null, // not pre-selected
  // Aero selections
  frontWing: 'none', // 'none' | 'low' | 'high'
  rearWing: 'none',  // 'none' | 'low' | 'high'
  sidepod: false,    // boolean
  seat: "carbon",
  steering: "pro",
  // Technical selections:
  tires: "avon",
  suspension: "double_wishbone",
  motor: "amk_4wd",
  brakes: "brembo",
  chassis: "tubular",
  battery: "molicel",
};

export const getInteriorImage = (section, state) => {
  if (section === 'seat') {
    if (state.seat === 'carbon') return '/assets/cars/Carbon-Fibre.png';
    return '/assets/cars/standard-seat.png';
  }
  if (section === 'steering') {
    if (state.steering === 'pro') return '/assets/cars/pro-display.png';
    return '/assets/cars/basic-steel.png';
  }
  return null;
};
