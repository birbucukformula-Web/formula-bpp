import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CarConfigurator from "./components/CarConfigurator";
import Forum from "./components/Forum";
import Garage from "./components/Garage";
import Footer from "./components/Footer";
import Header from "./components/layout/Header";
import LoginModal from "./components/modals/LoginModal";
import ProfileModal from "./components/modals/ProfileModal";
import { useConfig } from "./context/ConfigContext";
import "./App.css";

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const { 
    user, 
    toast, 
    configState, 
    handleConfigChange, 
    triggerToast, 
    setConfigState, 
    handleGoogleLogin, 
    handleLogout, 
    handleSaveProfile 
  } = useConfig();

  const onLogin = async () => {
    const success = await handleGoogleLogin();
    if (success) setShowLoginModal(false);
  };

  const onSaveProfile = async (nickname, avatarIndex) => {
    const success = await handleSaveProfile(nickname, avatarIndex);
    if (success) setShowProfileModal(false);
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
          <Route path="/" element={<CarConfigurator />} />
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
          onLogin={onLogin} 
        />
      )}

      {showProfileModal && user && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)} 
          onSave={onSaveProfile} 
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
