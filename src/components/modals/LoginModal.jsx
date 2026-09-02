import React from "react";

export default function LoginModal({ onClose, onLogin }) {
  return (
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
        width: "380px",
        background: "rgba(12, 12, 18, 0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(192, 0, 26, 0.1)",
        borderRadius: "24px",
        padding: "36px",
        position: "relative",
      }}>
        <button
          onClick={onClose}
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

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(192, 0, 26, 0.1)",
            border: "1px solid rgba(192, 0, 26, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            margin: "0 auto 16px",
            color: "#C0001A",
          }}>🏎️</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "0.02em", color: "#fff", margin: 0 }}>
            Join the FSE Team
          </h2>
          <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.4)", marginTop: "6px", letterSpacing: "0.03em" }}>
            Sign in with your Google account to access the pit lane portal.
          </p>
        </div>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "16px",
            background: "#ffffff",
            border: "none",
            borderRadius: "14px",
            color: "#1a1a24",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.05em",
            cursor: "pointer",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.15)",
            transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(255, 255, 255, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 255, 255, 0.15)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          SIGN IN WITH GOOGLE
        </button>
      </div>
    </div>
  );
}
