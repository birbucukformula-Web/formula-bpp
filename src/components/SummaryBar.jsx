// src/components/SummaryBar.jsx
import { COLORS, SECTIONS } from "../data/config";

export default function SummaryBar({ state }) {
  const colorLabel = COLORS.find(c => c.id === state.color)?.label || "";

  const getOptionLabel = (sectionId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section?.options) return "";
    return section.options.find(o => o.id === state[sectionId])?.label || "";
  };

  const jantLabel = state.jant ? state.jant.toUpperCase() : "";

  const aeroParts = [
    state.highWing && "High Wing",
    state.lowWing && "Low Wing",
    state.sidepod && "Sidepod",
  ].filter(Boolean);

  const parts = [
    state.model,
    colorLabel,
    jantLabel ? `${jantLabel} Rim` : "",
    ...aeroParts,
    getOptionLabel("koltuk"),
  ].filter(Boolean);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      flexWrap: "wrap", gap: "0",
    }}>
      {parts.map((part, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center" }}>
          <span style={{
            fontSize: "12px",
            color: i === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
            fontWeight: i === 0 ? 600 : 400,
            letterSpacing: "0.04em",
          }}>
            {part}
          </span>
          {i < parts.length - 1 && (
            <span style={{
              margin: "0 8px",
              color: "rgba(255,255,255,0.15)",
              fontSize: "10px",
            }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}
