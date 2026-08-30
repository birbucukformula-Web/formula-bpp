// src/components/OptionPanel.jsx
import { useState } from "react";
import { SECTIONS, COLORS } from "../data/config";

function SectionHeader({ section, isOpen, onClick, state }) {
  const isSpec = section.group === "Specs";
  
  const getSelectedLabel = () => {
    if (section.type === "color") {
      return COLORS.find(c => c.id === state.color)?.label || "";
    }
    if (section.options) {
      return section.options.find(o => o.id === state[section.id])?.label || "";
    }
    return section.info || "";
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        gap: "12px", padding: "16px 20px",
        background: isOpen ? "rgba(255,255,255,0.03)" : "transparent",
        border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
        cursor: "pointer",
        textAlign: "left", transition: "background 0.2s",
      }}
    >
      <span style={{
        width: "32px", height: "32px", borderRadius: "8px",
        background: "rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "14px", flexShrink: 0, color: isOpen ? "#C0001A" : "rgba(255,255,255,0.4)",
        transition: "color 0.2s",
      }}>
        {section.icon}
      </span>
      <span style={{ flex: 1 }}>
        <span style={{
          display: "block", fontSize: "11px", fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {section.label}
        </span>
        {isSpec ? (
          <span style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            color: "#4caf50",
            fontWeight: 600,
            marginTop: "3px",
            letterSpacing: "0.02em"
          }}>
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#4caf50",
              boxShadow: "0 0 8px #4caf50",
              display: "inline-block"
            }} />
            {getSelectedLabel()} (✓ Selected)
          </span>
        ) : (
          section.info && (
            <span style={{ display: "block", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
              {section.info}
            </span>
          )
        )}
      </span>
      <span style={{
        fontSize: "16px", color: "rgba(255,255,255,0.2)",
        transform: isOpen ? "rotate(90deg)" : "none",
        transition: "transform 0.2s",
      }}>
        ›
      </span>
    </button>
  );
}

function ColorOption({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color.label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        background: "transparent", border: "none", cursor: "pointer", padding: "6px",
        borderRadius: "8px",
      }}
    >
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        background: color.hex,
        border: selected
          ? "2px solid #fff"
          : "2px solid rgba(255,255,255,0.12)",
        outline: selected ? "1px solid #C0001A" : "none",
        outlineOffset: "2px",
        transition: "all 0.2s",
      }} />
      <span style={{
        fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase",
        color: selected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
        fontWeight: selected ? 600 : 400,
      }}>
        {color.label}
      </span>
    </button>
  );
}

function OptionItem({ option, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 16px", marginBottom: "6px",
        background: selected ? "rgba(200,0,26,0.08)" : "rgba(255,255,255,0.01)",
        border: selected
          ? "1px solid rgba(200,0,26,0.3)"
          : "1px solid rgba(255,255,255,0.04)",
        borderRadius: "8px", cursor: "pointer", textAlign: "left",
        transition: "all 0.2s",
      }}
    >
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
        border: selected ? "5px solid #C0001A" : "2px solid rgba(255,255,255,0.2)",
        transition: "border 0.2s",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "12px", fontWeight: selected ? 600 : 400,
          color: selected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
          letterSpacing: "0.02em",
        }}>
          {option.label}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
          {option.sub}
        </div>
      </div>
    </button>
  );
}

/**
 * AeroToggleItem — checkbox-style toggle card with a checkmark indicator.
 * Wings (high/low) are mutually exclusive; sidepod is independent.
 */
function AeroToggleItem({ label, sub, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 16px",
        marginBottom: "8px",
        background: active ? "rgba(192,0,26,0.1)" : "rgba(255,255,255,0.02)",
        border: active
          ? "1px solid rgba(192,0,26,0.45)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* Checkbox indicator */}
      <div style={{
        width: "20px",
        height: "20px",
        borderRadius: "6px",
        flexShrink: 0,
        background: active ? "#C0001A" : "transparent",
        border: active ? "2px solid #C0001A" : "2px solid rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        boxShadow: active ? "0 0 10px rgba(192,0,26,0.4)" : "none",
      }}>
        {active && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Icon */}
      <span style={{
        fontSize: "20px",
        lineHeight: 1,
        opacity: active ? 1 : 0.4,
        transition: "opacity 0.2s",
      }}>
        {icon}
      </span>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "12px",
          fontWeight: active ? 700 : 500,
          color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
          letterSpacing: "0.04em",
          transition: "color 0.2s",
        }}>
          {label}
        </div>
        <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>
          {sub}
        </div>
      </div>

      {/* Active pill */}
      {active && (
        <span style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#C0001A",
          background: "rgba(192,0,26,0.12)",
          border: "1px solid rgba(192,0,26,0.25)",
          borderRadius: "20px",
          padding: "3px 8px",
          whiteSpace: "nowrap",
        }}>
          ON
        </span>
      )}
    </button>
  );
}

export default function OptionPanel({ state, onChange, activeSection, setActiveSection, triggerToast }) {
  const [activeTab, setActiveTab] = useState("Exterior"); // "Exterior" | "Interior" | "Specs"

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Exterior") {
      setActiveSection("color");
    } else if (tab === "Interior") {
      setActiveSection("koltuk");
    } else {
      setActiveSection("lastik");
    }
  };

  const filteredSections = SECTIONS.filter(s => s.group === activeTab);

  // Regular options change triggers regular callbacks

  // Technical options behave as regular selectable options

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Porsche Style Tab Navigation */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "4px",
      }}>
        {[
          { id: "Exterior", label: "EXTERIOR" },
          { id: "Interior", label: "INTERIOR" },
          { id: "Specs",    label: "SPECS" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              flex: 1,
              padding: "12px 6px",
              background: activeTab === tab.id ? "rgba(255,255,255,0.04)" : "transparent",
              border: "none",
              color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
              borderBottom: activeTab === tab.id ? "2px solid #C0001A" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredSections.map(section => {
          const isOpen = activeSection === section.id;
          return (
            <div key={section.id}>
              <SectionHeader
                section={section}
                isOpen={isOpen}
                onClick={() => setActiveSection(isOpen ? null : section.id)}
                state={state}
              />

              {/* Expanded content */}
              {isOpen && section.changeable && (
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(0,0,0,0.15)",
                }}>
                  {section.type === "color" && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {COLORS.map(color => (
                        <ColorOption
                          key={color.id}
                          color={color}
                          selected={state.color === color.id}
                          onClick={() => {
                            onChange("color", color.id);
                            if (triggerToast) {
                              triggerToast(`Body Colour changed: ${color.label}`);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {section.type === "option" && (
                    <div>
                      {section.options.map(opt => (
                        <OptionItem
                          key={opt.id}
                          option={opt}
                          selected={state[section.id] === opt.id}
                          onClick={() => {
                            onChange(section.id, opt.id);
                            if (triggerToast) {
                              triggerToast(`${section.label} updated: ${opt.label}`);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {section.type === "aero-toggle" && (
                    <div>
                      {/* ── FRONT WING ── */}
                      <div style={{ padding: "8px 0", color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>Front Aero</div>
                      <AeroToggleItem
                        label="Front Wing (High)"
                        sub="High downforce front wing"
                        icon="🔼"
                        active={state.frontWing === 'high'}
                        onClick={() => {
                          const next = state.frontWing === 'high' ? 'none' : 'high';
                          onChange("frontWing", next);
                          if (triggerToast) triggerToast(next !== 'none' ? "High Front Wing added" : "Front Wing removed");
                        }}
                      />
                      <AeroToggleItem
                        label="Front Wing (Low)"
                        sub="Low drag front wing"
                        icon="🔽"
                        active={state.frontWing === 'low'}
                        onClick={() => {
                          const next = state.frontWing === 'low' ? 'none' : 'low';
                          onChange("frontWing", next);
                          if (triggerToast) triggerToast(next !== 'none' ? "Low Front Wing added" : "Front Wing removed");
                        }}
                      />

                      {/* ── REAR WING ── */}
                      <div style={{ padding: "8px 0", color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px" }}>Rear Aero</div>
                      <AeroToggleItem
                        label="Rear Wing (High)"
                        sub="High downforce rear wing"
                        icon="⏫"
                        active={state.rearWing === 'high'}
                        onClick={() => {
                          const next = state.rearWing === 'high' ? 'none' : 'high';
                          onChange("rearWing", next);
                          if (triggerToast) triggerToast(next !== 'none' ? "High Rear Wing added" : "Rear Wing removed");
                        }}
                      />
                      <AeroToggleItem
                        label="Rear Wing (Low)"
                        sub="Low drag rear wing"
                        icon="⏬"
                        active={state.rearWing === 'low'}
                        onClick={() => {
                          const next = state.rearWing === 'low' ? 'none' : 'low';
                          onChange("rearWing", next);
                          if (triggerToast) triggerToast(next !== 'none' ? "Low Rear Wing added" : "Rear Wing removed");
                        }}
                      />

                      {/* ── SIDEPOD ── */}
                      <div style={{ padding: "8px 0", color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "8px" }}>Bodywork</div>
                      <AeroToggleItem
                        label="Sidepod"
                        sub="Aerodynamic bodywork panels"
                        icon="⬛"
                        active={state.sidepod}
                        onClick={() => {
                          const next = !state.sidepod;
                          onChange("sidepod", next);
                          if (triggerToast) triggerToast(next ? "Sidepod added" : "Sidepod removed");
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
