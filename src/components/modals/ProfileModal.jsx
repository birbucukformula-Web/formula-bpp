import React, { useState, useEffect } from "react";
import { Avatar } from "../Avatar";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileModal({ user, onClose, onSave, onLoadBuild }) {
  const [nickname, setNickname] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [loadingBuilds, setLoadingBuilds] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.username || "");
      setAvatarIndex(user.avatarIndex || 0);
      
      // Fetch saved builds
      const fetchBuilds = async () => {
        setLoadingBuilds(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists() && snap.data().savedBuilds) {
            setSavedBuilds(snap.data().savedBuilds);
          }
        } catch (error) {
          console.error("Error fetching saved builds:", error);
        } finally {
          setLoadingBuilds(false);
        }
      };
      fetchBuilds();
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(nickname, avatarIndex);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(4, 4, 6, 0.8)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
    }}>
      <div style={{
        width: "420px",
        background: "rgba(12, 12, 18, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 40px rgba(192, 0, 26, 0.15)",
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

        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 24px", letterSpacing: "0.02em", textAlign: "center" }}>
          Driver Profile
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "12px", textAlign: "center" }}>
              CHOOSE YOUR HELMET
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                const isSelected = avatarIndex === i;
                return (
                  <div
                    key={i}
                    onClick={() => setAvatarIndex(i)}
                    style={{
                      cursor: "pointer",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Avatar index={i} size={76} />
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        bottom: "-8px",
                        width: "24px",
                        height: "4px",
                        background: "#C0001A",
                        borderRadius: "2px",
                        boxShadow: "0 0 8px #C0001A"
                      }}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
              ENGINEER NICKNAME
            </label>
            <input
              type="text"
              placeholder="e.g., KaanFSAE"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
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
              padding: "16px",
              background: "#C0001A",
              border: "none",
              borderRadius: "14px",
              color: "white",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginTop: "8px",
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
            SAVE PROFILE
          </button>
        </form>

        {/* Saved Builds Section */}
        <div style={{ marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", margin: "0 0 16px 0", letterSpacing: "0.05em" }}>
            KAYDEDİLMİŞ ARAÇLARIM
          </h3>
          
          {loadingBuilds ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textAlign: "center" }}>Yükleniyor...</div>
          ) : savedBuilds.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textAlign: "center" }}>Henüz kaydedilmiş bir aracınız yok.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
              {savedBuilds.map((build, index) => (
                <div key={build.id || index} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <div style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>
                      {build.config.model || "Araç"} Konfigürasyonu
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", marginTop: "4px" }}>
                      Tarih: {build.date}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onLoadBuild) {
                        onLoadBuild(build.config);
                        onClose();
                      }
                    }}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                  >
                    YÜKLE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
