// src/components/Garage.jsx
import { useState, useEffect } from "react";
import Footer from "./Footer";

const INITIAL_TIMELINE = [
  { id: "u1", date: "2025-09-10", version: "v1.0", title: "Base Configuration (Season Launch)", desc: "Initial assembly of the tubular space frame chassis, steering column, and suspension linkages.", effect: "Base Setup" },
  { id: "u2", date: "2025-10-18", version: "v1.1", title: "Suspension Geometry Revision", desc: "Adjusted double-wishbone pick-up points on the front chassis plate to optimize the roll center and reduce bump-steer.", effect: "+4% Cornering Grip" },
  { id: "u3", date: "2025-11-25", version: "v1.2", title: "Accumulator Thermal Cooling Upgrade", desc: "Designed custom 3D-printed cooling ducts directed at the lithium pouch modules to lower cell peak operating temps.", effect: "-15°C Peak Battery Temp" },
  { id: "u4", date: "2026-03-05", version: "v2.0", title: "Aerodynamic Wings Integration", desc: "Manufactured multi-element carbon fiber front and rear wing package after extensive CFD airflow modeling.", effect: "+12% Downforce, -4 kg weight" },
  { id: "u5", date: "2026-04-12", version: "v2.1", title: "AMK 4WD Motor Conversion", desc: "Swapped Emrax 228 rear motor for four independent AMK DD5 wheel-hub motors with active torque vectoring software control.", effect: "-0.45s 0-100 acceleration" }
];

const SECTIONS = [
  { id: "motor_assembly", label: "Motor Assembly", icon: "⚙" },
  { id: "replacement", label: "Component Replacement", icon: "🔄" },
  { id: "timeline", label: "Upgrade Tracker", icon: "📈" },
  { id: "rules", label: "FSE Rules Summary", icon: "📋" },
  { id: "composite", label: "Composite Manufacturing", icon: "🪨" },
  { id: "chassis", label: "Chassis Fabrication", icon: "🏗" },
  { id: "dynamics", label: "Vehicle Dynamics", icon: "📊" },
  { id: "aero", label: "Aerodynamics", icon: "💨" }
];

const SectionHeader = ({ title, sub }) => (
  <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
    <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>{title}</h1>
    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>{sub}</p>
  </div>
);
const VideoBlock = ({ title, src = "" }) => (
  <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192,0,26,0.08)" }}>
    <iframe width="100%" height="360" src={src} title={title} style={{ border: "none", display: "block" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
  </div>
);
const CheckStep = ({ idx, text, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "flex-start", gap: "14px", background: checked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)", border: checked ? "1px solid rgba(192,0,26,0.15)" : "1px solid rgba(255,255,255,0.03)", borderRadius: "12px", padding: "16px 20px", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s" }}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ marginTop: "2px", accentColor: "#C0001A", cursor: "pointer" }} />
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginRight: "8px" }}>STEP {idx + 1}</span>
      <span style={{ fontSize: "12.5px", color: checked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)", textDecoration: checked ? "line-through" : "none", lineHeight: "1.4" }}>{text}</span>
    </div>
  </label>
);
const WarnBox = ({ accent = "192,0,26", text }) => (
  <div style={{ background: `rgba(${accent},0.05)`, border: `1px solid rgba(${accent},0.25)`, boxShadow: `0 0 15px rgba(${accent},0.05)`, borderRadius: "16px", padding: "20px 24px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
    <span style={{ fontSize: "20px" }}>⚠️</span>
    <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.5" }}>{text}</p>
  </div>
);

export default function Garage({ user, triggerToast }) {
  const [activeSection, setActiveSection] = useState("motor_assembly");

  // Section 1: Checklist State (persisted in localStorage)
  const [checklist, setChecklist] = useState({});

  // Section 2: Replacement Tabs
  const [activeReplaceTab, setActiveReplaceTab] = useState("suspension");

  // Section 3: Timeline State (persisted in localStorage)
  const [timeline, setTimeline] = useState([]);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLogDate, setNewLogDate] = useState("");
  const [newLogVersion, setNewLogVersion] = useState("v1.0");
  const [newLogTitle, setNewLogTitle] = useState("");
  const [newLogDesc, setNewLogDesc] = useState("");
  const [newLogEffect, setNewLogEffect] = useState("");

  // Section 4: Accordion State
  const [openRuleIndex, setOpenRuleIndex] = useState(0);

  // Section 5: Composite checklist
  const [compositeChecklist, setCompositeChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fse_composite_checklist") || "{}"); } catch { return {}; }
  });
  // Section 6: Chassis checklist
  const [chassisChecklist, setChassisChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fse_chassis_checklist") || "{}"); } catch { return {}; }
  });
  // Section 7: Dynamics checklist + weight transfer scenario
  const [dynamicsChecklist, setDynamicsChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fse_dynamics_checklist") || "{}"); } catch { return {}; }
  });
  const [wtScenario, setWtScenario] = useState("accel");
  // Section 8: Aero checklist + slider values
  const [aeroChecklist, setAeroChecklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fse_aero_checklist") || "{}"); } catch { return {}; }
  });
  const [frontWingAngle, setFrontWingAngle] = useState(1);
  const [rearWingAngle, setRearWingAngle] = useState(1);

  const handleCompositeCheck = (id, v) => { const n={...compositeChecklist,[id]:v}; setCompositeChecklist(n); localStorage.setItem("fse_composite_checklist",JSON.stringify(n)); triggerToast(v?"Step completed!":"Step unchecked."); };
  const handleChassisCheck = (id, v) => { const n={...chassisChecklist,[id]:v}; setChassisChecklist(n); localStorage.setItem("fse_chassis_checklist",JSON.stringify(n)); triggerToast(v?"Step completed!":"Step unchecked."); };
  const handleDynamicsCheck = (id, v) => { const n={...dynamicsChecklist,[id]:v}; setDynamicsChecklist(n); localStorage.setItem("fse_dynamics_checklist",JSON.stringify(n)); triggerToast(v?"Step completed!":"Step unchecked."); };
  const handleAeroCheck = (id, v) => { const n={...aeroChecklist,[id]:v}; setAeroChecklist(n); localStorage.setItem("fse_aero_checklist",JSON.stringify(n)); triggerToast(v?"Step completed!":"Step unchecked."); };

  const WT_SCENARIOS = {
    accel:  { label:"Acceleration",  front:30, rear:70, loads:[false,false,true,true],  arrows:[{x1:200,y1:120,x2:200,y2:160,color:"#C0001A"},{x1:240,y1:120,x2:240,y2:160,color:"#C0001A"}] },
    brake:  { label:"Braking",       front:70, rear:30, loads:[true,true,false,false],   arrows:[{x1:200,y1:160,x2:200,y2:120,color:"#C0001A"},{x1:240,y1:160,x2:240,y2:120,color:"#C0001A"}] },
    leftTurn:  { label:"Left Turn",  front:35, rear:35, loads:[false,true,false,true],   arrows:[{x1:160,y1:140,x2:220,y2:140,color:"#C0001A"},{x1:160,y1:160,x2:220,y2:160,color:"#C0001A"}] },
    rightTurn: { label:"Right Turn", front:35, rear:35, loads:[true,false,true,false],   arrows:[{x1:280,y1:140,x2:220,y2:140,color:"#C0001A"},{x1:280,y1:160,x2:220,y2:160,color:"#C0001A"}] },
  };

  const aeroFront = [35,50,65][frontWingAngle];
  const aeroRear  = [30,45,58][rearWingAngle];
  const aeroDrag  = Math.round((aeroFront+aeroRear)*0.28);

  // Initialize and load states on mount
  useEffect(() => {
    // Load Checklist
    const savedCheck = localStorage.getItem("fse_garage_checklist");
    if (savedCheck) {
      try { setChecklist(JSON.parse(savedCheck)); } catch (e) {}
    }

    // Load Timeline
    const savedTime = localStorage.getItem("fse_upgrade_timeline");
    if (savedTime) {
      try {
        setTimeline(JSON.parse(savedTime));
      } catch (e) {
        setTimeline(INITIAL_TIMELINE);
      }
    } else {
      localStorage.setItem("fse_upgrade_timeline", JSON.stringify(INITIAL_TIMELINE));
      setTimeline(INITIAL_TIMELINE);
    }
  }, []);

  const handleCheckChange = (stepId, checked) => {
    const nextCheck = { ...checklist, [stepId]: checked };
    setChecklist(nextCheck);
    localStorage.setItem("fse_garage_checklist", JSON.stringify(nextCheck));
    triggerToast(checked ? "Step marked as completed!" : "Step unchecked.");
  };

  const handleAddTimelineEntry = (e) => {
    e.preventDefault();
    if (!newLogDate || !newLogTitle || !newLogDesc || !newLogEffect) {
      triggerToast("Please fill in all fields.");
      return;
    }

    const newEntry = {
      id: "log_" + Date.now(),
      date: newLogDate,
      version: newLogVersion,
      title: newLogTitle,
      desc: newLogDesc,
      effect: newLogEffect
    };

    const nextTimeline = [newEntry, ...timeline];
    setTimeline(nextTimeline);
    localStorage.setItem("fse_upgrade_timeline", JSON.stringify(nextTimeline));

    // Reset & close
    setShowAddLogModal(false);
    setNewLogDate("");
    setNewLogVersion("v1.0");
    setNewLogTitle("");
    setNewLogDesc("");
    setNewLogEffect("");
    triggerToast("Performance upgrade logged successfully!");
  };

  return (
    <div className="responsive-garage-layout" style={{
      display: "flex",
      width: "100%",
      height: "100%",
      background: "#08080c",
      overflow: "hidden",
    }}>
      
      {/* ── LEFT FIXED SIDEBAR ── */}
      <aside className="responsive-garage-sidebar" style={{
        width: "280px",
        background: "rgba(10, 10, 15, 0.6)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.03)",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <div style={{ marginBottom: "30px", paddingLeft: "10px" }}>
          <span style={{ fontSize: "9px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            PIT GARAGE MANUAL
          </span>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", margin: "4px 0 0", letterSpacing: "0.02em" }}>
            Garage Manual
          </h2>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 20px",
                  background: isActive ? "rgba(192, 0, 26, 0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(192, 0, 26, 0.25)" : "1px solid transparent",
                  borderRadius: "14px",
                  color: isActive ? "#fff" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                  }
                }}
              >
                <span style={{ fontSize: "16px" }}>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── RIGHT DYNAMIC CONTENT AREA ── */}
      <main className="responsive-garage-main" style={{
        flex: 1,
        padding: "40px 60px",
        boxSizing: "border-box",
        overflowY: "auto",
        background: "radial-gradient(ellipse 70% 70% at 50% 50%, #151522 0%, #06060a 100%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "30px" }}>

          {/* ──────────────── SECTION 1: MOTOR ASSEMBLY ──────────────── */}
          {activeSection === "motor_assembly" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Electric Motor Assembly Guide</h1>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                  For AMK & Emrax series brushless electric motors integration.
                </p>
              </div>

              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                This standard operating procedure describes mounting high-voltage permanent magnet axial flux (Emrax) or direct-drive wheel-hub (AMK) electric motor units to the vehicle. Correct physical alignment prevents load fatigue and ensures optimized power efficiency.
              </p>

              {/* Video Player */}
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192, 0, 26, 0.08)",
              }}>
                <iframe 
                  width="100%" 
                  height="360" 
                  src="https://www.youtube.com/embed/Hg7MXIgeig4?si=AgzoLUi8b9UAeT0X" 
                  title="How to Design an Electric Powertrain (FSAE)"
                  style={{ border: "none", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen>
                </iframe>
              </div>

              {/* Step-by-Step Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", marginBottom: "6px" }}>
                  Assembly Quality Checklist
                </h3>
                {[
                  "Align the motor shaft with the hub centerline to prevent torque stress.",
                  "Weld the torque arm bracket securely to the steel tubular spaceframe or insert into monocoque mounts.",
                  "Apply premium thermal paste and secure double-sided cooling jackets.",
                  "Connect high-voltage U/V/W phase cables in the correct technical rotation order.",
                  "Verify resolver/encoder signal feedback and calibrate phase offset.",
                  "Torque terminal phase bolts using a calibrated torque wrench (specified Nm value).",
                  "Measure isolation resistance between Tractive System (HV) and Ground (GLV) - must exceed 1 MΩ.",
                  "Upload parameters, maps, and thermal thresholds to the motor controller (inverter).",
                  "Conduct first low-speed rotation test under dyno or jack-stand parameters.",
                  "Inspect the drive units using a thermal camera to monitor heat dissipation.",
                ].map((step, idx) => {
                  const stepId = `step_${idx + 1}`;
                  const isChecked = !!checklist[stepId];
                  return (
                    <label
                      key={stepId}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        background: isChecked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.01)",
                        border: isChecked ? "1px solid rgba(192,0,26,0.15)" : "1px solid rgba(255,255,255,0.03)",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        cursor: "pointer",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                      onMouseLeave={(e) => {
                        if (!isChecked) e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
                        else e.currentTarget.style.borderColor = "rgba(192,0,26,0.15)";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheckChange(stepId, e.target.checked)}
                        style={{
                          marginTop: "2px",
                          accentColor: "#C0001A",
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginRight: "8px" }}>
                          STEP {idx + 1}
                        </span>
                        <span style={{
                          fontSize: "12.5px",
                          color: isChecked ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
                          textDecoration: isChecked ? "line-through" : "none",
                          lineHeight: "1.4",
                        }}>
                          {step}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Red Safety Warning Box */}
              <div style={{
                background: "rgba(192, 0, 26, 0.05)",
                border: "1px solid rgba(192, 0, 26, 0.25)",
                boxShadow: "0 0 15px rgba(192,0,26,0.05)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "0.05em" }}>
                    HIGH VOLTAGE SAFETY NOTICE
                  </h4>
                  <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.5" }}>
                    All High Voltage (HV) connections must be carried out while the tractive system is completely locked out and disconnected. Verify with an insulation tester before physical contact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── SECTION 2: COMPONENT REPLACEMENT ──────────────── */}
          {activeSection === "replacement" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Critical Component Replacement Protocols</h1>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                  Standard maintenance intervals, specialized garage tooling, and step-by-step swap procedures.
                </p>
              </div>

              {/* Video Player */}
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192, 0, 26, 0.08)",
              }}>
                <iframe 
                  width="100%" 
                  height="360" 
                  src="https://www.youtube.com/embed/4u4ainhZvBA" 
                  title="Formula Student Suspension Design"
                  style={{ border: "none", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen>
                </iframe>
              </div>

              {/* Tab Selector */}
              <div style={{
                display: "flex",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "4px",
              }}>
                {[
                  { id: "suspension", label: "Suspension" },
                  { id: "brakes", label: "Brakes" },
                  { id: "battery", label: "Battery Cells" }
                ].map((tab) => {
                  const isTabActive = activeReplaceTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveReplaceTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        background: isTabActive ? "#C0001A" : "transparent",
                        border: "none",
                        borderRadius: "10px",
                        color: isTabActive ? "#white" : "rgba(255,255,255,0.5)",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab.label.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENTS */}
              {activeReplaceTab === "suspension" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>MAINTENANCE FREQUENCY</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>Inspect before every competition event or test day.</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>REQUIRED TOOLING</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>Torque wrench, spherical bearing press, digital calipers.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3 style={{ fontSize: "12px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.1em" }}>PROCEDURE STEPS</h3>
                    {[
                      "Support vehicle weight on custom chassis stands and remove wheel assemblies.",
                      "Loosen double-wishbone jam nuts and locknuts at front/rear chassis structural mounts.",
                      "Press out worn or dirty spherical bearings using specialized hydraulic bearing tools.",
                      "Inspect A-arm carbon-tubing bonds for any micro-fractures under UV flashlight.",
                      "Press-fit premium high-grade spherical bearings and check zero binding.",
                      "Re-mount A-arms and wishbones, torque structural bolts to 45 Nm.",
                      "Conduct laser track alignment, measuring vehicle toe-in and camber angles.",
                      "Adjust pushrods to set default target roll center and static ride height."
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{idx + 1}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.4", marginTop: "2px" }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warning Box */}
                  <div style={{ background: "rgba(255, 190, 11, 0.04)", border: "1px solid rgba(255, 190, 11, 0.25)", borderRadius: "16px", padding: "16px 20px" }}>
                    <span style={{ fontSize: "11px", color: "#FFBE0B", fontWeight: 800, letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>CRITICAL CHECK</span>
                    <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.5" }}>
                      Always verify that wishbone spherical rod ends are mounted with sufficient safety thread engagement (minimum 1.5 times the thread diameter).
                    </p>
                  </div>
                </div>
              )}

              {activeReplaceTab === "brakes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>MAINTENANCE FREQUENCY</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>Swap pads after every 20 track hours or pad width is under 3mm.</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>REQUIRED TOOLING</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>Brake caliper slide socket set, bleeding syringe, DOT 5.1 fluid.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3 style={{ fontSize: "12px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.1em" }}>PROCEDURE STEPS</h3>
                    {[
                      "Safely lift the vehicle and remove tires.",
                      "Extract pad retaining clips and slide pad guide pins outwards.",
                      "Carefully push back pistons without scratching cylinder walls.",
                      "Remove dirty brake pads and blow dust with clean compressed air.",
                      "Insert fresh high-friction brake pads (Brembo racing compound or custom AP).",
                      "Re-seat pad retaining clips and tighten guide pins.",
                      "Bleed master brake cylinders to expel micro-bubbles and top up fluid.",
                      "Perform high-pressure brake pedal test to check for any slow fluid leaks."
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{idx + 1}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.4", marginTop: "2px" }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warning Box */}
                  <div style={{ background: "rgba(255, 190, 11, 0.04)", border: "1px solid rgba(255, 190, 11, 0.25)", borderRadius: "16px", padding: "16px 20px" }}>
                    <span style={{ fontSize: "11px", color: "#FFBE0B", fontWeight: 800, letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>CRITICAL CHECK</span>
                    <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.5" }}>
                      New brake pad friction materials require proper thermal bedding-in before racing. Avoid immediate harsh panic stops to prevent glazing.
                    </p>
                  </div>
                </div>
              )}

              {activeReplaceTab === "battery" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>MAINTENANCE FREQUENCY</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>Perform cell swaps if capacity drops under 85% or cell delta >50mV.</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>REQUIRED TOOLING</span>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginTop: "4px" }}>HV gloves (Class 0, 1000V), insulated torque wrench, cell balancer.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h3 style={{ fontSize: "12px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.1em" }}>PROCEDURE STEPS</h3>
                    {[
                      "Engage master shut-off switch and lock out the high-voltage tractive system.",
                      "Unscrew accumulator container cover bolts using insulated socket tooling.",
                      "Measure cell voltages to identify defective pouch modules.",
                      "Carefully disconnect module copper busbars wearing safety HV rated gloves.",
                      "Extract damaged cell pouches and balance the replacement module cell voltages.",
                      "Slide in new balanced pouch cells and reconnect BMS monitoring wire terminals.",
                      "Reinstall copper busbars, torque hex nuts to exactly 9 Nm using insulated wrenches.",
                      "Run a high-voltage isolation checkout test before bolting accumulator lid."
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{idx + 1}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.4", marginTop: "2px" }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warning Box */}
                  <div style={{ background: "rgba(255, 190, 11, 0.04)", border: "1px solid rgba(255, 190, 11, 0.25)", borderRadius: "16px", padding: "16px 20px" }}>
                    <span style={{ fontSize: "11px", color: "#FFBE0B", fontWeight: 800, letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>CRITICAL CHECK</span>
                    <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: "1.5" }}>
                      Never balance cells directly inside the container when connected to other modules. Always isolate cells completely before active external charging/balancing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── SECTION 3: UPGRADE TRACKER (METAMORPHOSE) ──────────────── */}
          {activeSection === "timeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
                  <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Vehicle Metamorphosis Log</h1>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                    Chronological performance upgrade timeline throughout the race season.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLogModal(true)}
                  style={{
                    background: "#C0001A",
                    border: "none",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    padding: "8px 18px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(192, 0, 26, 0.25)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E00024";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(224, 0, 36, 0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#C0001A";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(192, 0, 26, 0.25)";
                  }}
                >
                  + LOG UPGRADE
                </button>
              </div>

              {/* Video Player */}
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192, 0, 26, 0.08)",
                marginBottom: "10px",
              }}>
                <iframe 
                  width="100%" 
                  height="360" 
                  src="https://www.youtube.com/embed/ELDw6XzpNWg" 
                  title="Formula Student Upgrade Assembly and Testing"
                  style={{ border: "none", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen>
                </iframe>
              </div>

              {/* Vertical Timeline Component */}
              <div style={{
                position: "relative",
                paddingLeft: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "36px",
                marginTop: "20px",
              }}>
                {/* Center vertical bar */}
                <div style={{
                  position: "absolute",
                  left: "14px",
                  top: "10px",
                  bottom: "10px",
                  width: "2px",
                  background: "rgba(255,255,255,0.06)",
                }} />

                {timeline.map((item) => (
                  <div key={item.id} style={{ position: "relative" }}>
                    
                    {/* Glowing timeline dot */}
                    <div style={{
                      position: "absolute",
                      left: "-32px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#C0001A",
                      border: "3px solid #08080c",
                      boxShadow: "0 0 10px #C0001A",
                      zIndex: 5,
                    }} />

                    {/* Timeline card */}
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      borderRadius: "20px",
                      padding: "24px 30px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                            {item.date}
                          </span>
                          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: "4px 0 0", letterSpacing: "0.02em" }}>
                            {item.title}
                          </h3>
                        </div>
                        <span style={{
                          fontSize: "9px",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                        }}>
                          {item.version}
                        </span>
                      </div>

                      <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "rgba(255, 255, 255, 0.7)", margin: 0 }}>
                        {item.desc}
                      </p>

                      <div style={{ display: "flex", justifyContent: "flex-start", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "12px" }}>
                        <span style={{
                          fontSize: "9px",
                          background: "rgba(192,0,26,0.15)",
                          border: "1px solid rgba(192,0,26,0.25)",
                          color: "#C0001A",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontWeight: 800,
                          letterSpacing: "0.05em",
                        }}>
                          🚀 IMPACT: {item.effect}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── SECTION 4: FSE RULES ACCORDION ──────────────── */}
          {activeSection === "rules" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ borderLeft: "4px solid #C0001A", paddingLeft: "16px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: 0 }}>Formula Student Rules 2025 — Critical EV Clauses</h1>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0", letterSpacing: "0.03em" }}>
                  Key safety regulations and technical constraints for high voltage systems.
                </p>
              </div>

              {/* Video Player */}
              <div style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192, 0, 26, 0.08)",
                marginBottom: "10px",
              }}>
                <iframe 
                  width="100%" 
                  height="360" 
                  src="https://www.youtube.com/embed/ITCft4dbjuM" 
                  title="Formula Student Rules and Technical Scrutineering"
                  style={{ border: "none", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen>
                </iframe>
              </div>

              {/* Accordion Component */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  {
                    rule: "EV 1.1 — High Voltage System Bounds (600V DC max)",
                    summary: "The maximum permitted voltage in the tractive system (HV accumulator, inverters, motor terminals) is strictly limited to 600V DC. Any voltage violation measured during dynamic events leads to immediate disqualification."
                  },
                  {
                    rule: "EV 2.3 — Galvanic Isolation Requirements",
                    summary: "Complete electrical isolation must be maintained between the low-voltage control systems (GLV) and the high-voltage tractive systems (TS) at all times. Optocouplers or galvanic isolators must secure all communication signals."
                  },
                  {
                    rule: "EV 4.1 — TSAL (Tractive System Active Light)",
                    summary: "A Tractive System Active Light (TSAL) must be clearly mounted on the main roll hoop. It must flash red when high voltage is active (>60V DC or active capacitors) and glow solid green when safe."
                  },
                  {
                    rule: "T 1.2 — Vehicle Weight and Wheelbase Limits",
                    summary: "The vehicle wheelbase must be at least 1525 mm. The track width must be at least 75% of the wheelbase, and total vehicle length must satisfy structural frame safety clearances to prevent crush hazards."
                  },
                  {
                    rule: "EV 8 — IMD (Isolation Monitoring Device) Compliance",
                    summary: "An Isolation Monitoring Device (Bender A-ISOMETER) must be hardwired into the HV accumulator. It must instantly trigger the safety shutdown loop if the isolation falls below the threshold of 500 ohms/volt."
                  },
                  {
                    rule: "SG 5 — Safety Shutdown Circuit Design",
                    summary: "The safety shutdown loop must consist of series-connected emergency stop switches, brake over-travel switch (BOTS), cockpit master switch, and battery management system (BMS) shutdown relays."
                  }
                ].map((item, idx) => {
                  const isOpen = openRuleIndex === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255, 255, 255, 0.01)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.2s",
                      }}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => setOpenRuleIndex(isOpen ? -1 : idx)}
                        style={{
                          width: "100%",
                          padding: "20px 24px",
                          background: isOpen ? "rgba(255,255,255,0.02)" : "transparent",
                          border: "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 800, color: isOpen ? "#fff" : "rgba(255,255,255,0.85)", letterSpacing: "0.02em" }}>
                          {item.rule}
                        </span>
                        <span style={{ fontSize: "14px", color: isOpen ? "#C0001A" : "rgba(255,255,255,0.3)" }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* Accordion Expandable Panel */}
                      {isOpen && (
                        <div style={{
                          padding: "24px 30px",
                          borderTop: "1px solid rgba(255,255,255,0.03)",
                          background: "rgba(0,0,0,0.15)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}>
                          <p style={{ fontSize: "12.5px", lineHeight: "1.6", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                            {item.summary}
                          </p>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); triggerToast("FSE Rulebook PDF download link coming soon!"); }}
                              style={{
                                fontSize: "10px",
                                color: "#C0001A",
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                textDecoration: "none",
                              }}
                            >
                              READ FULL RULE TEXT →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──────────────── SECTION 5: COMPOSITE MANUFACTURING ──────────────── */}
          {activeSection === "composite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SectionHeader title="Composite Manufacturing Guide" sub="Carbon fibre layup, vacuum bagging and curing procedures" />
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Carbon fibre composite panels form the backbone of Formula Student monocoque structures and aerodynamic bodywork. Wet layup uses room-temperature curing resin systems applied directly to the mould, while prepreg materials require controlled autoclave or oven cure cycles to achieve the optimal fibre volume fraction and a superior surface finish.
              </p>
              <VideoBlock title="Composite Layup — Part 1" src="https://www.youtube.com/embed/3uhR4jdFiS4" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", marginBottom: "6px" }}>Layup Quality Checklist</h3>
                {[
                  "Prepare mould surface with release agent (minimum 3 coats)",
                  "Cut carbon fibre plies according to the ply schedule drawing",
                  "Mix epoxy resin and hardener at the specified weight ratio",
                  "Apply first ply with correct fibre orientation (0°/45°/90°)",
                  "Remove air bubbles using a laminating roller",
                  "Continue layup following the stacking sequence",
                  "Place peel ply and breather fabric over the laminate",
                  "Seal vacuum bag and check for leaks (target: <5 mbar/min)",
                  "Apply vacuum and cure at specified temperature and duration",
                  "Post-cure in oven if required; demould after full cure cycle",
                ].map((step, idx) => {
                  const id = `comp_step_${idx + 1}`;
                  return <CheckStep key={id} idx={idx} text={step} checked={!!compositeChecklist[id]} onChange={v => handleCompositeCheck(id, v)} />;
                })}
              </div>
              <WarnBox accent="192,0,26" text="RESIN SAFETY: Always work in a ventilated area with nitrile gloves and respiratory protection. Uncured epoxy is a skin sensitizer and respiratory hazard." />
            </div>
          )}

          {/* ──────────────── SECTION 6: CHASSIS FABRICATION ──────────────── */}
          {activeSection === "chassis" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SectionHeader title="Chassis Fabrication & Welding Guide" sub="Steel tubular spaceframe TIG welding procedures" />
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                The Formula Student vehicle chassis is a tubular spaceframe constructed from 4130 chromoly steel. A precisely set up welding jig ensures dimensional accuracy before any arc is struck, while controlled heat input and correct filler rod selection (ER80S-D2) are essential to achieve the required joint strength and prevent thermal distortion.
              </p>
              <VideoBlock title="Chassis Welding — Part 1" src="https://www.youtube.com/embed/Z-Yx6cdavNo" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", marginBottom: "6px" }}>Fabrication Quality Checklist</h3>
                {[
                  "Verify tube dimensions and wall thickness against design drawings",
                  "Set up welding jig and confirm squareness with a dial gauge",
                  "Cut tubes to length using a cold saw; deburr all ends",
                  "Cope tube joints using a tube notcher for full contact fit-up",
                  "Tack weld all joints in sequence to prevent thermal distortion",
                  "Verify chassis geometry after tacking (measure diagonals)",
                  "Complete full TIG welds using correct filler rod (ER80S-D2)",
                  "Inspect all welds visually; perform dye penetrant test on critical nodes",
                  "Stress relieve if required; straighten any distorted tubes",
                  "Apply primer and protective coating within 24 hours of welding",
                ].map((step, idx) => {
                  const id = `chas_step_${idx + 1}`;
                  return <CheckStep key={id} idx={idx} text={step} checked={!!chassisChecklist[id]} onChange={v => handleChassisCheck(id, v)} />;
                })}
              </div>
              <WarnBox accent="192,0,26" text="WELDING SAFETY: Use auto-darkening helmet (minimum shade 10), leather gloves and fire-resistant clothing. Ensure adequate ventilation to avoid fume inhalation." />
            </div>
          )}

          {/* ──────────────── SECTION 7: VEHICLE DYNAMICS ──────────────── */}
          {activeSection === "dynamics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SectionHeader title="Vehicle Dynamics & Setup Guide" sub="Suspension tuning, weight transfer and lap time fundamentals" />
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Vehicle dynamics parameters such as ride height, camber, toe and spring rates directly influence lap time across Formula Student events. Autocross rewards agility and transient response, while Endurance demands consistent handling over a longer stint with varying tyre temperatures and fuel load.
              </p>
              <VideoBlock title="Vehicle Dynamics — Setup Fundamentals" src="https://www.youtube.com/embed/o1TBrE3LZv8" />

              {/* Interactive Weight Transfer Diagram */}
              <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.03em" }}>⚡ Weight Transfer Diagram</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[["accel","Acceleration"],["brake","Braking"],["leftTurn","Left Turn"],["rightTurn","Right Turn"]].map(([key, label]) => (
                    <button key={key} onClick={() => setWtScenario(key)} style={{ padding: "8px 18px", background: wtScenario === key ? "#C0001A" : "rgba(255,255,255,0.04)", border: wtScenario === key ? "1px solid rgba(192,0,26,0.4)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.05em" }}>
                      {label.toUpperCase()}
                    </button>
                  ))}
                </div>
                <svg viewBox="0 0 440 260" style={{ width: "100%", display: "block" }}>
                  <defs>
                    <marker id="wtArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                      <path d="M0,0 L0,8 L8,4 Z" fill="#C0001A" />
                    </marker>
                  </defs>
                  {/* Car body */}
                  <rect x="110" y="55" width="220" height="150" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                  <text x="220" y="43" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontWeight="700" letterSpacing="2">FRONT</text>
                  <text x="220" y="228" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontWeight="700" letterSpacing="2">REAR</text>
                  {/* Tyre patches */}
                  {[
                    { cx: 128, cy: 80,  label: "FL", i: 0 },
                    { cx: 312, cy: 80,  label: "FR", i: 1 },
                    { cx: 128, cy: 180, label: "RL", i: 2 },
                    { cx: 312, cy: 180, label: "RR", i: 3 },
                  ].map(({ cx, cy, label, i }) => {
                    const loaded = WT_SCENARIOS[wtScenario].loads[i];
                    return (
                      <g key={label}>
                        <ellipse cx={cx} cy={cy} rx="30" ry="19" fill={loaded ? "rgba(192,0,26,0.4)" : "rgba(59,130,246,0.2)"} stroke={loaded ? "#C0001A" : "#3B82F6"} strokeWidth="2" style={{ transition: "all 0.4s" }} />
                        <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800">{label}</text>
                      </g>
                    );
                  })}
                  {/* Direction arrows per scenario */}
                  {wtScenario === "accel"     && <line x1="220" y1="185" x2="220" y2="145" stroke="#C0001A" strokeWidth="3" markerEnd="url(#wtArrow)" />}
                  {wtScenario === "brake"     && <line x1="220" y1="125" x2="220" y2="95"  stroke="#C0001A" strokeWidth="3" markerEnd="url(#wtArrow)" />}
                  {wtScenario === "leftTurn"  && <line x1="185" y1="130" x2="265" y2="130" stroke="#C0001A" strokeWidth="3" markerEnd="url(#wtArrow)" />}
                  {wtScenario === "rightTurn" && <line x1="255" y1="130" x2="175" y2="130" stroke="#C0001A" strokeWidth="3" markerEnd="url(#wtArrow)" />}
                  {/* Label */}
                  {wtScenario === "accel"     && <text x="232" y="168" fill="#C0001A" fontSize="9" fontWeight="700">REARWARD</text>}
                  {wtScenario === "brake"     && <text x="232" y="113" fill="#C0001A" fontSize="9" fontWeight="700">FORWARD</text>}
                  {wtScenario === "leftTurn"  && <text x="185" y="122" fill="#C0001A" fontSize="9" fontWeight="700">RIGHTWARD</text>}
                  {wtScenario === "rightTurn" && <text x="175" y="122" fill="#C0001A" fontSize="9" fontWeight="700">LEFTWARD</text>}
                  {/* Legend */}
                  <circle cx="50" cy="220" r="8" fill="rgba(192,0,26,0.4)" stroke="#C0001A" strokeWidth="2" />
                  <text x="63" y="224" fill="rgba(255,255,255,0.6)" fontSize="9">Loaded</text>
                  <circle cx="120" cy="220" r="8" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="2" />
                  <text x="133" y="224" fill="rgba(255,255,255,0.6)" fontSize="9">Unloaded</text>
                </svg>
                <div style={{ display: "flex", justifyContent: "center", gap: "32px" }}>
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: 800 }}>Front: <span style={{ color: "#C0001A" }}>{WT_SCENARIOS[wtScenario].front}%</span></span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>/</span>
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: 800 }}>Rear: <span style={{ color: "#C0001A" }}>{WT_SCENARIOS[wtScenario].rear}%</span></span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", marginBottom: "6px" }}>Setup Procedure Checklist</h3>
                {[
                  "Set ride height: front 25mm / rear 30mm (baseline)",
                  "Set corner weights on flat patch; target ±2% cross weight",
                  "Adjust front and rear anti-roll bar stiffness",
                  "Set camber: front -2.5° / rear -1.5° (baseline)",
                  "Set toe: front 0° / rear +0.5° toe-in (baseline)",
                  "Record and compare damper bump/rebound settings per corner",
                  "Perform back-to-back lap time test after each change",
                  "Log all changes in the Upgrade Tracker section",
                ].map((step, idx) => {
                  const id = `dyn_step_${idx + 1}`;
                  return <CheckStep key={id} idx={idx} text={step} checked={!!dynamicsChecklist[id]} onChange={v => handleDynamicsCheck(id, v)} />;
                })}
              </div>
            </div>
          )}

          {/* ──────────────── SECTION 8: AERODYNAMICS ──────────────── */}
          {activeSection === "aero" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SectionHeader title="Aerodynamics Guide" sub="Downforce, drag and airflow management for FSE cars" />
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Aerodynamic elements — front wing, rear wing and underbody diffuser — generate downforce that increases tyre grip without adding mass. On a Formula Student electric vehicle, balancing downforce against drag penalty is critical, as the power budget is fixed and aero drag directly reduces top speed and endurance range.
              </p>
              <VideoBlock title="Aerodynamics — Wing Setup & CFD Basics" src="https://www.youtube.com/embed/1Al8n2KrT2k" />

              {/* Interactive Aero Diagram */}
              <div style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "0.03em" }}>🌬 Downforce vs Drag — Aero Balance Chart</h3>

                {/* Car side-profile SVG with airflow arrows */}
                <svg viewBox="0 0 480 200" style={{ width: "100%", display: "block" }}>
                  <defs>
                    <marker id="blueArr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 Z" fill="#3B82F6"/></marker>
                    <marker id="redArr"  markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 Z" fill="#EF4444"/></marker>
                    <marker id="orgArr"  markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L0,7 L7,3.5 Z" fill="#F97316"/></marker>
                  </defs>
                  {/* Ground */}
                  <line x1="20" y1="158" x2="460" y2="158" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  {/* Car silhouette */}
                  <path d="M80,155 L80,110 Q90,90 120,85 L180,80 Q210,65 240,62 Q270,60 300,62 L340,68 Q360,72 370,85 L390,105 L400,155 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  {/* Front wing */}
                  <rect x="72" y="148" width="30" height="6" rx="2" fill="rgba(59,130,246,0.4)" stroke="#3B82F6" strokeWidth="1"/>
                  {/* Rear wing */}
                  <rect x="368" y="88" width="32" height="7" rx="2" fill="rgba(239,68,68,0.4)" stroke="#EF4444" strokeWidth="1"/>
                  {/* Blue downforce arrows over front wing */}
                  <line x1="87" y1="130" x2="87" y2="148" stroke="#3B82F6" strokeWidth={1 + frontWingAngle * 0.8} markerEnd="url(#blueArr)"/>
                  <line x1="95" y1="125" x2="95" y2="148" stroke="#3B82F6" strokeWidth={1 + frontWingAngle * 0.8} markerEnd="url(#blueArr)"/>
                  {/* Red suction arrows under diffuser */}
                  <line x1="320" y1="140" x2="320" y2="157" stroke="#EF4444" strokeWidth={1 + rearWingAngle * 0.6} markerEnd="url(#redArr)"/>
                  <line x1="340" y1="138" x2="340" y2="157" stroke="#EF4444" strokeWidth={1 + rearWingAngle * 0.6} markerEnd="url(#redArr)"/>
                  {/* Orange drag arrows at rear */}
                  <line x1="400" y1="105" x2="435" y2="105" stroke="#F97316" strokeWidth={1 + (frontWingAngle + rearWingAngle) * 0.4} markerEnd="url(#orgArr)"/>
                  <line x1="402" y1="118" x2="440" y2="118" stroke="#F97316" strokeWidth={1 + (frontWingAngle + rearWingAngle) * 0.4} markerEnd="url(#orgArr)"/>
                  {/* Legend */}
                  <circle cx="30" cy="175" r="5" fill="#3B82F6"/><text x="40" y="179" fill="rgba(255,255,255,0.6)" fontSize="9">Downforce</text>
                  <circle cx="110" cy="175" r="5" fill="#EF4444"/><text x="120" y="179" fill="rgba(255,255,255,0.6)" fontSize="9">Suction</text>
                  <circle cx="180" cy="175" r="5" fill="#F97316"/><text x="190" y="179" fill="rgba(255,255,255,0.6)" fontSize="9">Drag</text>
                </svg>

                {/* Sliders */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { label: "Front Wing Angle", value: frontWingAngle, set: setFrontWingAngle },
                    { label: "Rear Wing Angle",  value: rearWingAngle,  set: setRearWingAngle  },
                  ].map(({ label, value, set }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 700, width: "130px", flexShrink: 0 }}>{label.toUpperCase()}</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", width: "30px" }}>{["Low","Med","High"][value]}</span>
                      <input type="range" min="0" max="2" step="1" value={value} onChange={e => set(Number(e.target.value))} style={{ flex: 1, accentColor: "#C0001A", cursor: "pointer" }} />
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { label: "Front Wing Downforce", value: aeroFront, color: "#3B82F6" },
                    { label: "Rear Wing Downforce",  value: aeroRear,  color: "#EF4444" },
                    { label: "Drag Penalty",          value: aeroDrag,  color: "#F97316" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{label}</span>
                        <span style={{ fontSize: "10px", color, fontWeight: 800 }}>{value}%</span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", marginBottom: "6px" }}>Aero Setup Checklist</h3>
                {[
                  "Measure front wing angle of attack; set baseline at 8°",
                  "Measure rear wing angle of attack; set baseline at 12°",
                  "Check end plate gap to tyre: minimum 10mm clearance",
                  "Inspect all carbon fibre aero elements for delamination",
                  "Verify diffuser ride height: minimum 20mm ground clearance",
                  "Run CFD simulation or wool-tuft test to visualise flow separation",
                  "Record downforce balance (front %) at target competition speed",
                  "Adjust wing angles in 2° increments; log results in Upgrade Tracker",
                ].map((step, idx) => {
                  const id = `aero_step_${idx + 1}`;
                  return <CheckStep key={id} idx={idx} text={step} checked={!!aeroChecklist[id]} onChange={v => handleAeroCheck(id, v)} />;
                })}
              </div>
              <WarnBox accent="255,190,11" text="AERO NOTE: Never run the vehicle without end plates at speed. Asymmetric downforce from a missing end plate can cause sudden directional instability above 60 km/h." />
            </div>
          )}

        </div>
      </main>

      {/* ── MODAL: ADD PERFORMANCE LOG ENTRY ── */}
      {showAddLogModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(4, 4, 6, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}>
          <div style={{
            width: "480px",
            background: "rgba(12, 12, 18, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(192, 0, 26, 0.1)",
            borderRadius: "24px",
            padding: "36px",
            position: "relative",
          }}>
            <button
              onClick={() => setShowAddLogModal(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "18px",
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
            >
              ✕
            </button>

            <div style={{ marginBottom: "26px" }}>
              <span style={{ fontSize: "10px", color: "#C0001A", fontWeight: 800, letterSpacing: "0.12em" }}>
                PIT GARAGE METAMORPHOSIS
              </span>
              <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "0.02em", color: "#fff", margin: "6px 0 0" }}>
                Log Technical Upgrade
              </h2>
            </div>

            <form onSubmit={handleAddTimelineEntry} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                    UPGRADE DATE
                  </label>
                  <input
                    type="date"
                    value={newLogDate}
                    onChange={(e) => setNewLogDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ width: "120px" }}>
                  <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                    VERSION CODE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., v2.2"
                    value={newLogVersion}
                    onChange={(e) => setNewLogVersion(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  UPGRADE TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g., CFRP Sidepods Installation..."
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  TECHNICAL DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the upgrade parameters..."
                  value={newLogDesc}
                  onChange={(e) => setNewLogDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  PERFORMANCE IMPACT METRIC
                </label>
                <input
                  type="text"
                  placeholder="e.g., +15% cooling efficiency / -1.2 kg weight"
                  value={newLogEffect}
                  onChange={(e) => setNewLogEffect(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#C0001A",
                  border: "none",
                  borderRadius: "14px",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 4px 20px rgba(192, 0, 26, 0.3)",
                  transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E00024";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(224, 0, 36, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C0001A";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(192, 0, 26, 0.3)";
                }}
              >
                SUBMIT LOG ENTRY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
