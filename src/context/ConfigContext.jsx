import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { DEFAULT_STATE } from "../data/config";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [configState, setConfigState] = useState(DEFAULT_STATE);

  const handleConfigChange = (key, value) => {
    setConfigState((prev) => ({ ...prev, [key]: value }));
  };

  const triggerToast = useCallback((message) => {
    setToast(null);
    setTimeout(() => {
      setToast({ message });
    }, 50);
  }, []);

  // Clear toast after 3s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

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

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      triggerToast("Giriş başarılı!");
      return true;
    } catch (error) {
      triggerToast(`Giriş hatası: ${error.message}`);
      return false;
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
      return false;
    }
    
    const updatedNickname = nickname.trim();
    setUser(prev => ({
      ...prev,
      username: updatedNickname,
      avatarIndex: avatarIndex
    }));
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
    return true;
  };

  const value = {
    user,
    toast,
    configState,
    handleConfigChange,
    triggerToast,
    setConfigState,
    handleGoogleLogin,
    handleLogout,
    handleSaveProfile
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
