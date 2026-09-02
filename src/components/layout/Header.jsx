import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "../Avatar";

export default function Header({ user, onShowLogin, onShowProfile, onLogout }) {
  return (
    <header className="responsive-header" style={{
      position: "relative",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 40px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
      background: "rgba(10, 10, 15, 0.8)",
      backdropFilter: "blur(20px)",
      flexShrink: 0,
    }}>
      {/* Left Section: Branding */}
      <NavLink 
        to="/"
        style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}
      >
        <img
          src="/assets/team-logo.png"
          alt="Adana Formula Student Logo"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "10px",
            filter: "drop-shadow(0 0 10px rgba(192, 0, 26, 0.6))",
            marginTop: "-10px",
            marginBottom: "-10px",
          }}
        />
        <div>
          <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.15em", color: "#fff" }}>1.5 ADANA FORMULA STUDENT</div>
          <div style={{ fontSize: "8px", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.2em", marginTop: "1px" }}>CUSTOMIZE STUDIO</div>
        </div>
      </NavLink>

      {/* Center Section: Navigation Links */}
      <nav className="responsive-nav" style={{ display: "flex", gap: "28px" }}>
        {[
          { id: "configurator", label: "CUSTOMIZE", path: "/" },
          { id: "forum", label: "PIT LANE FORUM", path: "/forum" },
          { id: "garage", label: "GARAGE GUIDE", path: "/garage" },
          { id: "about", label: "ABOUT US", url: "https://birbucukadanaformula.com/" },
        ].map((item) => {
          if (item.url) {
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  padding: "8px 4px",
                  cursor: "pointer",
                  textDecoration: "none",
                  position: "relative",
                  transition: "color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)"}
              >
                {item.label}
              </a>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              style={({ isActive }) => ({
                background: "none",
                border: "none",
                textDecoration: "none",
                color: isActive ? "#fff" : "rgba(255, 255, 255, 0.5)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                padding: "8px 4px",
                cursor: "pointer",
                position: "relative",
                transition: "color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              })}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "#C0001A",
                      boxShadow: "0 0 8px #C0001A",
                      borderRadius: "2px",
                    }} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Right Section: Auth Indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar index={user.avatarIndex} size={52} />
              <span style={{ fontSize: "16px", fontWeight: 700, color: "rgba(255, 255, 255, 0.9)" }}>
                {user.username}
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={onShowProfile}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                }}
              >
                PROFILE
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(192, 0, 26, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(192, 0, 26, 0.3)";
                  e.currentTarget.style.color = "#C0001A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                }}
              >
                SIGN OUT
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onShowLogin}
            style={{
              background: "#C0001A",
              border: "none",
              borderRadius: "20px",
              color: "white",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              padding: "8px 18px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(192, 0, 26, 0.25)",
              transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
            JOIN TEAM
          </button>
        )}
      </div>
    </header>
  );
}
