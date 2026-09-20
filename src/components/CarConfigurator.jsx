// src/components/CarConfigurator.jsx
import { useState, useRef } from "react";
import CarViewer from "./CarViewer";
import OptionPanel from "./OptionPanel";
import ModelSelector from "./ModelSelector";
import CheckoutModal from "./CheckoutModal";
import SummaryBar from "./SummaryBar";
import Footer from "./Footer";
import { calculateMetrics } from "../utils/physicsEngine";
import { useConfig } from "../context/ConfigContext";

export default function CarConfigurator() {
  const { configState: state, handleConfigChange: onChange } = useConfig();
  const [activeSection, setActiveSection] = useState("color");
  const [showCheckout, setShowCheckout] = useState(false);
  const sidebarRef = useRef(null);

  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const metrics = calculateMetrics(state);

  return (
    <div className="responsive-layout">
      {/* CSS overrides for global styling */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* ── SOL: Viewer ve Bilgi Ekranı ── */}
      <div className="responsive-viewer-container">
        {/* Lüks Stüdyo Arka Planı (Radial Gradient) */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, #151522 0%, #06060a 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />


        {/* Ana Araba Görsel Alanı */}
        <div style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          zIndex: 5,
        }}>
          <CarViewer activeSection={activeSection} />
        </div>

        {/* Alt Özet ve Performans Barı */}
        <div className="responsive-metrics">
          <div className="responsive-summary-bar" style={{ flex: 1, minWidth: "200px" }}>
            <SummaryBar />
          </div>

          {/* Porsche Style Performance Metrics */}
          <div style={{ display: "flex", gap: "24px" }}>
            {[
              { label: "WEIGHT", value: metrics.weight, sub: metrics.weightSub },
              { label: "POWER", value: metrics.power, sub: metrics.engineSub },
              { label: "ACCELERATION", value: metrics.accel, sub: metrics.accelSub },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "right" }}>
                <div style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "8.5px", letterSpacing: "0.15em", fontWeight: 700 }}>
                  {stat.label}
                </div>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: 800, marginTop: "2px", letterSpacing: "-0.02em", transition: "color 0.2s" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#C0001A", fontSize: "8.5px", letterSpacing: "0.05em", marginTop: "1px", transition: "color 0.2s" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── RIGHT: Luxury Configuration Panel (Glassmorphic) ── */}
      <div className="responsive-sidebar" ref={sidebarRef}>
        <div className="responsive-model-selector" style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", justifyContent: "center" }}>
          <ModelSelector selected={state.model} onChange={(v) => handleChange("model", v)} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <OptionPanel
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Order Save Button */}
        <div style={{
          padding: "24px 30px 30px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(0,0,0,0.4)",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setShowCheckout(true)}
            style={{
              width: "100%",
              padding: "16px",
              background: "#C0001A",
              border: "none",
              borderRadius: "28px",
              color: "white",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              boxShadow: "0 4px 20px rgba(192, 0, 26, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E00024";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(224, 0, 36, 0.5)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#C0001A";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(192, 0, 26, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            SAVE & VIEW DETAILS
          </button>

          {/* Mobile Scroll to Top Button */}
          <button
            className="mobile-scroll-top-btn"
            onClick={scrollToTop}
            style={{
              width: "100%",
              padding: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "28px",
              color: "white",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              marginTop: "12px",
            }}
          >
            ↑ YUKARI KAYDIR
          </button>
        </div>
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
