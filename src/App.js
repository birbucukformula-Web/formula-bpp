import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import CarConfigurator from "./components/CarConfigurator";
import Forum from "./components/Forum";
import Garage from "./components/Garage";
import Footer from "./components/Footer";
import Header from "./components/layout/Header";
import LoginModal from "./components/modals/LoginModal";
import ProfileModal from "./components/modals/ProfileModal";
import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEFAULT_STATE } from "./data/config";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [configState, setConfigState] = useState(DEFAULT_STATE);

  const handleConfigChange = (key, value) => setConfigState((prev) => ({ ...prev, [key]: value }));

  const triggerToast = useCallback((message) => {
    setToast(null);
    setTimeout(() => {
      setToast({ message });
    }, 50);
  }, []);

  // Load auth state and profile from Firebase on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const fallbackName = currentUser.displayName || currentUser.email?.split('@')[0] || "Driver";
        
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
          } else {
            await setDoc(userRef, { nickname: fallbackName, avatarIndex: 0 }).catch((e) => {
              console.error("Profil oluşturulurken hata oluştu", e);
            });
          }
        } catch (error) {
          console.error("Firestore veritabanına bağlanılamadı, ancak lokal giriş başarılı:", error);
          triggerToast("Veritabanına bağlanılamadı, bazı özellikler çevrimdışı çalışabilir.");
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [triggerToast]);

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
      triggerToast("Giriş başarılı!");
    } catch (error) {
      triggerToast(`Giriş hatası: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    const prevUser = user?.username;
    try {
      await signOut(auth);
      triggerToast(`Görüşmek üzere, ${prevUser || "Mühendis"}!`);
    } catch (error) {
      triggerToast("Çıkış yapılırken bir hata oluştu");
    }
  };

  const handleSaveProfile = async (nickname, avatarIndex) => {
    if (!nickname.trim()) {
      triggerToast("Kullanıcı adı boş olamaz!");
      return;
    }
    
    const updatedNickname = nickname.trim();
    setUser(prev => ({
      ...prev,
      username: updatedNickname,
      avatarIndex: avatarIndex
    }));
    setShowProfileModal(false);
    triggerToast("Profil uygulandı!");
    
    localStorage.setItem(`fs_profile_${user.uid}`, JSON.stringify({
      nickname: updatedNickname,
      avatarIndex: avatarIndex
    }));

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        nickname: updatedNickname,
        avatarIndex: avatarIndex
      }, { merge: true });
    } catch (error) {
      console.error("Error saving to DB:", error);
      triggerToast("Bilgiler sadece bu cihaz için kaydedildi (Veritabanı hatası).");
    }
  };

  return (
    <div className="app-container">
      <Header 
        user={user} 
        onShowLogin={() => setShowLoginModal(true)} 
        onShowProfile={() => setShowProfileModal(true)} 
        onLogout={handleLogout} 
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<CarConfigurator user={user} triggerToast={triggerToast} state={configState} onChange={handleConfigChange} />} />
          <Route path="/forum" element={<Forum user={user} triggerToast={triggerToast} openLogin={() => setShowLoginModal(true)} />} />
          <Route path="/garage" element={<Garage user={user} triggerToast={triggerToast} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <Footer style={{ margin: 0, padding: 0, border: "none", background: "transparent" }} />
      </footer>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLogin={handleGoogleLogin} 
        />
      )}

      {showProfileModal && user && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)} 
          onSave={handleSaveProfile} 
          onLoadBuild={(build) => setConfigState(build)}
        />
      )}

      {toast && (
        <div className="toast-notification">
          <div className="toast-icon" />
          <span className="toast-text">
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
