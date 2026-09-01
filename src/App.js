import { useState, useEffect } from "react";
import CarConfigurator from "./components/CarConfigurator";
import Forum from "./components/Forum";
import Garage from "./components/Garage";
import Footer from "./components/Footer";
import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [page, setPage] = useState("configurator");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileNickname, setProfileNickname] = useState("");
  const [profileAvatarIndex, setProfileAvatarIndex] = useState(0);
  const [toast, setToast] = useState(null);

  // Load auth state and profile from Firebase on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. HIZLI GİRİŞ: Veritabanı (Firestore) yanıt vermezse/gecikirse uygulama kilitlenmesin diye hemen varsayılan bilgilerle giriş yap!
        const fallbackName = currentUser.displayName || currentUser.email?.split('@')[0] || "Driver";
        
        // F5 atıldığında bilgilerin kaybolmaması için önce LocalStorage'a bakalım
        const localDataRaw = localStorage.getItem(`fs_profile_${currentUser.uid}`);
        let localProfile = null;
        if (localDataRaw) {
          try { localProfile = JSON.parse(localDataRaw); } catch(e) {}
        }
        
        const initialName = localProfile?.nickname || fallbackName;
        const initialAvatar = localProfile?.avatarIndex ?? 0;

        setUser({ 
          uid: currentUser.uid, 
          username: initialName,
          avatarIndex: initialAvatar 
        });
        setProfileNickname(initialName);
        setProfileAvatarIndex(initialAvatar);

        // 2. Arka planda sessizce veritabanından özel profili çekmeye çalış
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const profileData = userSnap.data();
            setUser({ 
              uid: currentUser.uid, 
              username: profileData.nickname || fallbackName,
              avatarIndex: profileData.avatarIndex || 0 
            });
            setProfileNickname(profileData.nickname || fallbackName);
            setProfileAvatarIndex(profileData.avatarIndex || 0);
          } else {
            // Veritabanında yoksa, sessizce oluştur
            await setDoc(userRef, { nickname: fallbackName, avatarIndex: 0 }).catch(() => {});
          }
        } catch (error) {
          console.error("Firestore veritabanına bağlanılamadı, ancak lokal giriş başarılı:", error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
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

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
      triggerToast("Signed in successfully!");
    } catch (error) {
      triggerToast(`Error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    const prevUser = user?.username;
    try {
      await signOut(auth);
      triggerToast(`Goodbye, ${prevUser || "Engineer"}!`);
    } catch (error) {
      triggerToast("Error signing out");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileNickname.trim()) {
      triggerToast("Nickname cannot be empty!");
      return;
    }
    
    // Optimistic UI Update: Veritabanını beklemeden arayüzü anında güncelle (hız hissi verir)
    const updatedNickname = profileNickname.trim();
    setUser(prev => ({
      ...prev,
      username: updatedNickname,
      avatarIndex: profileAvatarIndex
    }));
    setShowProfileModal(false);
    triggerToast("Profile applied!");
    
    // Ayrıca localStorage'a da anında yazalım ki F5 atınca kaybolmasın (eğer DB yavaşsa)
    localStorage.setItem(`fs_profile_${user.uid}`, JSON.stringify({
      nickname: updatedNickname,
      avatarIndex: profileAvatarIndex
    }));

    // Arka planda veritabanına kaydet
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        nickname: updatedNickname,
        avatarIndex: profileAvatarIndex
      }, { merge: true });
    } catch (error) {
      console.error("Error saving to DB:", error);
      triggerToast("Bilgiler sadece bu cihaz için kaydedildi (Veritabanı hatası).");
    }
  };

  const renderAvatarSprite = (index, size = 28) => {
    // 3x3 Grid Calculation
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 0 8px rgba(192, 0, 26, 0.3)",
        border: "2px solid #C0001A",
        background: "white",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          backgroundImage: "url('/assets/avatars_sprite.jpg')",
          backgroundSize: "300% 300%",
          backgroundPosition: `${col * 50}% ${row * 50}%`,
        }} />
      </div>
    );
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
            { id: "about", label: "ABOUT US", url: "https://birbucukadanaformula.com/" },
          ].map((item) => {
            const isActive = page === item.id;
            
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
                {renderAvatarSprite(user.avatarIndex, 36)}
                <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255, 255, 255, 0.85)" }}>
                  {user.username}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowProfileModal(true)}
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

      {/* ── GLOBAL FOOTER ── */}
      <footer style={{
        background: "rgba(10, 10, 15, 0.95)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "12px 40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        zIndex: 100,
      }}>
        <Footer style={{ margin: 0, padding: 0, border: "none", background: "transparent" }} />
      </footer>

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
                Sign in with your Google account to access the pit lane portal.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
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
      )}

      {/* ── PROFILE SETTINGS MODAL ── */}
      {showProfileModal && user && (
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
              onClick={() => setShowProfileModal(false)}
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

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Avatar Selection Grid */}
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
                    const isSelected = profileAvatarIndex === i;
                    return (
                      <div
                        key={i}
                        onClick={() => setProfileAvatarIndex(i)}
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
                        {renderAvatarSprite(i, 76)}
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

              {/* Nickname Input */}
              <div>
                <label style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
                  ENGINEER NICKNAME
                </label>
                <input
                  type="text"
                  placeholder="e.g., KaanFSAE"
                  value={profileNickname}
                  onChange={(e) => setProfileNickname(e.target.value)}
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
