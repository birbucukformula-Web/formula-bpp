// src/components/Footer.jsx
export default function Footer({ style = {} }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      background: "rgba(0, 0, 0, 0.4)",
      padding: "6px 12px",
      borderRadius: "4px",
      borderLeft: "3px solid #C0001A",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      marginTop: "30px",
      marginBottom: "20px",
      width: "fit-content",
      marginInline: "auto",
      ...style
    }}>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Powered by
      </span>
      <a
        href="https://birbucukadanaformula.com/"
        target="_blank"
        rel="noreferrer"
        style={{
          color: "white",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.05em",
          textDecoration: "none",
          transition: "all 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#C0001A"}
        onMouseLeave={(e) => e.currentTarget.style.color = "white"}
      >
        1.5 FORMULA STUDENT TEAM
      </a>
    </div>
  );
}
