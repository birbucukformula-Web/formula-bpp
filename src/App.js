// src/App.js
import { useState, useEffect } from "react";
import CarConfigurator from "./components/CarConfigurator";
import Forum from "./components/Forum";
import Garage from "./components/Garage";

export default function App() {
  const [page, setPage] = useState("configurator");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [toast, setToast] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("fse_username");
    if (savedUser) {
      setUser({ username: savedUser });
    }
  }, []);

  const triggerToast = (message) => {
    setToast(null);
    setTimeout(() => {
      setToast({ message });
    }, 50);
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      triggerToast("Username cannot be empty!");
      return;
    }
    const cleanUsername = usernameInput.trim();
    localStorage.setItem("fse_username", cleanUsername);
    setUser({ username: cleanUsername });
    setShowLoginModal(false);
    setUsernameInput("");
    setPasswordInput("");
    triggerToast(`Welcome to the Team, ${cleanUsername}!`);
  };

  const handleLogout = () => {
    const prevUser = user?.username;
    localStorage.removeItem("fse_username");
    setUser(null);
    triggerToast(`Goodbye, ${prevUser || "Engineer"}!`);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100vh",
      background: "#08080c",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "white",
      overflow: "hidden",
    }}>
      {/* ── SHARED HEADER (Porsche-Inspired Glassmorphic Navigation) ── */}
      <header style={{
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
        <div 
          onClick={() => setPage("configurator")} 
          style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
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
        </div>

        {/* Center Section: Navigation Links */}
        <nav style={{ display: "flex", gap: "28px" }}>
          {[
            { id: "configurator", label: "CUSTOMIZE" },
            { id: "forum", label: "PIT LANE FORUM" },
            { id: "garage", label: "GARAGE GUIDE" },
          ].map((item) => {
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: isActive ? "#fff" : "rgba(255, 255, 255, 0.5)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  padding: "8px 4px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
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
              </button>
            );
          })}
        </nav>

        {/* Right Section: Auth Indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C0001A 0%, #E00024 100%)",
                  boxShadow: "0 0 8px rgba(192, 0, 26, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#white",
                }}>
                  {getInitials(user.username)}
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.85)" }}>
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
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
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
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

      {/* ── DYNAMIC PAGE VIEWS ── */}
      <main style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {page === "configurator" && (
          <CarConfigurator user={user} triggerToast={triggerToast} />
        )}
        {page === "forum" && (
          <Forum user={user} triggerToast={triggerToast} openLogin={() => setShowLoginModal(true)} />
        )}
        {page === "garage" && (
          <Garage user={user} triggerToast={triggerToast} />
        )}
      </main>

      {/* ── AUTHENTICATION MODAL (Glassmorphic) ── */}
      {showLoginModal && (
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
              onClick={() => setShowLoginModal(false)}
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
                Enter your nickname to sign in to the pit lane portal.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  ENGINEER NICKNAME
                </label>
                <input
                  type="text"
                  placeholder="e.g., KaanFSAE"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
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
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#C0001A";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  PASSCODE (DOES NOT VALIDATE)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
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
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#C0001A";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
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
                JOIN THE TEAM
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── GLOBAL TOAST NOTIFICATION ── */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(192, 0, 26, 0.15)",
          borderRadius: "16px",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          animation: "toast-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          pointerEvents: "none",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#C0001A",
            boxShadow: "0 0 8px #C0001A",
          }} />
          <span style={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}>
            {toast.message}
          </span>
        </div>
      )}

      <style>{`
        @keyframes modal-fade-in {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes toast-fade-in {
          0% { opacity: 0; transform: translate(-50%, -15px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
