// src/components/CheckoutModal.jsx
import { useState } from "react";
import { findBestImage } from "./CarViewer";
import { COLORS, SECTIONS } from "../data/config";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function CheckoutModal({ state, user, triggerToast, onClose }) {
  const [isSaving, setIsSaving] = useState(false);
  const imageUrl = findBestImage(state);

  const getOptionLabel = (sectionId, valueId) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section || !section.options) return valueId || "Seçilmedi";
    const option = section.options.find(o => o.id === valueId);
    return option ? option.label : (valueId || "Seçilmedi");
  };

  const colorLabel = COLORS.find(c => c.id === state.color)?.label || state.color;
  const wheelsLabel = state.wheels && state.wheels !== "none" ? getOptionLabel("wheels", state.wheels) : "Standart/Yok";
  const seatLabel = getOptionLabel("seat", state.seat);
  const steeringLabel = getOptionLabel("steering", state.steering);
  const tiresLabel = getOptionLabel("tires", state.tires);
  const suspensionLabel = getOptionLabel("suspension", state.suspension);
  const motorLabel = getOptionLabel("motor", state.motor);
  const brakesLabel = getOptionLabel("brakes", state.brakes);
  const chassisLabel = getOptionLabel("chassis", state.chassis);
  const batteryLabel = getOptionLabel("battery", state.battery);

  const frontAeroLabel = state.frontWing === "high" ? "High Downforce Front Wing" : state.frontWing === "low" ? "Low Drag Front Wing" : "Yok";
  const rearAeroLabel = state.rearWing === "high" ? "High Downforce Rear Wing" : state.rearWing === "low" ? "Low Drag Rear Wing" : "Yok";
  const sidepodLabel = state.sidepod ? "Var" : "Yok";

  const emailBody = `Merhaba, yapılandırdığım ${state.model} araç hakkında konuşmak istiyorum.

Aşağıda aracımın tüm detaylarını görebilirsiniz:

[ DIŞ TASARIM ]
• Şasi Rengi: ${colorLabel}
• Jantlar: ${wheelsLabel}
• Ön Kanat: ${frontAeroLabel}
• Arka Kanat: ${rearAeroLabel}
• Sidepod: ${sidepodLabel}

[ İÇ TASARIM ]
• Koltuk: ${seatLabel}
• Direksiyon: ${steeringLabel}

[ TEKNİK ÖZELLİKLER ]
• Şasi Tipi: ${chassisLabel}
• Motor: ${motorLabel}
• Batarya: ${batteryLabel}
• Lastik: ${tiresLabel}
• Süspansiyon: ${suspensionLabel}
• Frenler: ${brakesLabel}

Geri dönüşünüzü bekliyorum. Teşekkürler.`;

  const mailtoHref = `mailto:info@birbucukadanaformula.com?subject=${encodeURIComponent("Yeni Araç Konfigürasyonu İsteği - " + state.model)}&body=${encodeURIComponent(emailBody)}`;

  const handleSaveBuild = async () => {
    if (!user) {
      triggerToast("Lütfen önce giriş yapın!");
      return;
    }
    
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const newBuild = {
        id: Date.now().toString(),
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        config: state
      };
      
      await updateDoc(userRef, {
        savedBuilds: arrayUnion(newBuild)
      });
      triggerToast("Araç profiline başarıyla kaydedildi!");
    } catch (error) {
      console.error("Save build error:", error);
      triggerToast("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      animation: "fadeIn 0.3s ease-out",
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "900px",
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >
          ✕
        </button>

        <div style={{ padding: "40px 40px 20px 40px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
            Hadi bunun hakkında konuşalım
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>
            Mükemmel aracınızı yapılandırdınız. Şimdi sonraki adımları keşfedin.
          </p>
        </div>

        {/* Car Image Preview */}
        <div style={{
          width: "100%",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          margin: "0 0 20px 0",
        }}>
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Final Configuration" 
              style={{
                width: "80%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))"
              }}
            />
          )}
        </div>

        {/* Action Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          padding: "20px 40px 40px 40px",
        }}>

          {/* Save Profile Card */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(33, 150, 243, 0.1)",
              color: "#2196f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "16px",
            }}>
              💾
            </div>
            <h3 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>Profile Kaydet</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              Bu konfigürasyonu profiline kaydet ve istediğin zaman geri yükle.
            </p>
            <button 
              onClick={handleSaveBuild}
              disabled={isSaving}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: isSaving ? "rgba(255,255,255,0.1)" : "#2196f3",
                color: "white",
                border: "none",
                fontWeight: 600,
                fontSize: "13px",
                borderRadius: "30px",
                transition: "all 0.2s",
                marginTop: "auto",
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
          
          {/* Location Card */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(76, 175, 80, 0.1)",
              color: "#4caf50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "16px",
            }}>
              📍
            </div>
            <h3 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>Atölyemizi Ziyaret Edin</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              Aracınızı atölyemizde bir Formula danışmanıyla gözden geçirin. Zorunluluk yok, sadece olasılıklar.
            </p>
            <a 
              href="https://maps.app.goo.gl/u2vXeuySr9Shzhe47"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "white",
                color: "black",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "13px",
                borderRadius: "30px",
                transition: "all 0.2s",
                marginTop: "auto",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#e0e0e0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
            >
              Yol Tarifi Al
            </a>
          </div>

          {/* Email Card */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(192, 0, 26, 0.1)",
              color: "#C0001A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              marginBottom: "16px",
            }}>
              ✉️
            </div>
            <h3 style={{ fontSize: "18px", margin: "0 0 8px 0" }}>Nasıl bağlanacağınızı seçin</h3>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              Sorgunuz ve yapı detaylarınız seçtiğiniz e-posta adresine gönderilir. Ekibimiz sizinle iletişime geçecektir.
            </p>
            <a 
              href={mailtoHref}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#C0001A",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "13px",
                borderRadius: "30px",
                transition: "all 0.2s",
                marginTop: "auto",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E00024"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#C0001A"; }}
            >
              Bize E-posta Gönder
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
