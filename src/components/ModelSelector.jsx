// src/components/ModelSelector.jsx
import { MODELS } from "../data/config";

export default function ModelSelector({ selected, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {MODELS.map(model => (
        <button
          key={model.id}
          onClick={() => onChange(model.id)}
          style={{
            padding: "7px 18px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            background: selected === model.id
              ? "rgba(20, 20, 25, 0.9)"
              : "rgba(20, 20, 25, 0.5)",
            backdropFilter: "blur(10px)",
            border: selected === model.id
              ? "1px solid rgba(255,255,255,0.3)"
              : "1px solid rgba(255,255,255,0.1)",
            color: selected === model.id
              ? "white"
              : "rgba(255,255,255,0.5)",
            transition: "all 0.15s",
            fontFamily: "inherit",
          }}
        >
          {model.id}
        </button>
      ))}
    </div>
  );
}
