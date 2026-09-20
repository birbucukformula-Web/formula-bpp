// src/components/CarViewer.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { getInteriorImage } from "../data/config";
import carsList from "../data/carsList.json";
import { useConfig } from "../context/ConfigContext";

const MIN_SCALE = 1;
const MAX_SCALE = 3;

const AVAILABLE_FILES = carsList;

export const findBestImage = (state) => {
  const c = state.color || 'white';
  const w = (!state.wheels || state.wheels === 'none') ? 'base' : state.wheels;
  
  const hasSidepod = !!state.sidepod;
  const hasFront = state.frontWing && state.frontWing !== 'none';
  const hasRear = state.rearWing && state.rearWing !== 'none';

  const match = AVAILABLE_FILES.find(file => {
    const lower = file.toLowerCase();
    
    // 1. Renk ve Jant kontrolü
    if (!lower.includes(c)) return false;
    if (!lower.includes(w)) return false;
    
    // 2. Sidepod kontrolü (Eğer isteniyorsa adında geçmeli, istenmiyorsa geçmemeli)
    if (hasSidepod && !lower.includes('sidepod')) return false;
    if (!hasSidepod && lower.includes('sidepod')) return false;
    
    // 3. Ön Kanat kontrolü
    if (hasFront) {
      const kw = state.frontWing; // 'low' veya 'high'
      const regex = new RegExp(`(?:^|[-_])(${kw}front|${kw}-front|front-${kw})(?:[-_.]|$)`);
      if (!regex.test(lower)) return false;
    } else {
      if (lower.includes('front')) return false;
    }
    
    // 4. Arka Kanat kontrolü
    if (hasRear) {
      const kw = state.rearWing; // 'low' veya 'high'
      const regex = new RegExp(`(?:^|[-_])(${kw}rear|${kw}-rear|rear-${kw})(?:[-_.]|$)`);
      if (!regex.test(lower)) return false;
    } else {
      if (lower.includes('rear')) return false;
    }

    // 5. Hiçbir aero yoksa bare veya car olmalı
    if (!hasSidepod && !hasFront && !hasRear) {
      if (!lower.includes('bare') && !lower.includes('car')) return false;
    }

    return true;
  });

  return match ? `/assets/cars/${match}?v=2` : null;
};

export default function CarViewer({ activeSection }) {
  const { configState: state } = useConfig();
  const [currentImage, setCurrentImage] = useState(findBestImage(state));
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentExteriorImage, setCurrentExteriorImage] = useState(`/assets/cars/white-base-car.webp`);
  const [prevExteriorImage, setPrevExteriorImage] = useState(`/assets/cars/white-base-car.webp`);
  const [isFading, setIsFading] = useState(false);

  const containerRef = useRef(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const lastDist = useRef(null);
  const lastMidpoint = useRef(null);
  const lastPan = useRef(null);
  const isDragging = useRef(false);

  const isInterior = activeSection === "seat" || activeSection === "steering";
  const interiorSrc = isInterior ? getInteriorImage(activeSection, state) : null;

  // State değiştikçe yeni kombinasyon resmini bul. Bulunursa crossfade ile güncelle.
  useEffect(() => {
    const bestImage = findBestImage(state);
    if (bestImage && bestImage !== currentExteriorImage) {
      setPrevExteriorImage(currentExteriorImage); // Mevcut resmi arkaya at
      setCurrentExteriorImage(bestImage);         // Yeni resmi öne al
      setIsFading(true);                          // Geçişi başlat (yeni resim opacity 0)
      
      // DOM güncellendikten hemen sonra opacity 1'e doğru animasyonu tetikle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsFading(false);
        });
      });
    }
  }, [state, currentExteriorImage]);

  const clampOffset = useCallback((ox, oy, sc) => {
    if (!containerRef.current) return { x: ox, y: oy };
    const { width: W, height: H } = containerRef.current.getBoundingClientRect();
    const maxX = (W * (sc - 1)) / 2;
    const maxY = (H * (sc - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, ox)),
      y: Math.min(maxY, Math.max(-maxY, oy)),
    };
  }, []);

  const applyTransform = useCallback((newScale, newOffset) => {
    const clamped = clampOffset(newOffset.x, newOffset.y, newScale);
    scaleRef.current = newScale;
    offsetRef.current = clamped;
    setScale(newScale);
    setOffset(clamped);
  }, [clampOffset]);

  const onTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.hypot(dx, dy);
      lastMidpoint.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      lastPan.current = null;
      isDragging.current = false;
    } else if (e.touches.length === 1) {
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDragging.current = true;
      lastDist.current = null;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current * (dist / lastDist.current)));
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const panDx = midX - lastMidpoint.current.x;
      const panDy = midY - lastMidpoint.current.y;
      lastDist.current = dist;
      lastMidpoint.current = { x: midX, y: midY };
      applyTransform(newScale, { x: offsetRef.current.x + panDx, y: offsetRef.current.y + panDy });
    } else if (e.touches.length === 1 && isDragging.current && lastPan.current) {
      if (scaleRef.current <= 1) return;
      const dx = e.touches[0].clientX - lastPan.current.x;
      const dy = e.touches[0].clientY - lastPan.current.y;
      lastPan.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      applyTransform(scaleRef.current, { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy });
    }
  }, [applyTransform]);

  const onTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length < 2) { lastDist.current = null; lastMidpoint.current = null; }
    if (e.touches.length === 0) { isDragging.current = false; lastPan.current = null; }
    if (scaleRef.current < 1) applyTransform(1, { x: 0, y: 0 });
  }, [applyTransform]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current * (e.deltaY > 0 ? 0.95 : 1.05)));
    applyTransform(newScale, newScale === 1 ? { x: 0, y: 0 } : offsetRef.current);
  }, [applyTransform]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const opts = { passive: false };
    el.addEventListener("touchstart", onTouchStart, opts);
    el.addEventListener("touchmove", onTouchMove, opts);
    el.addEventListener("touchend", onTouchEnd, opts);
    el.addEventListener("wheel", onWheel, opts);
    return () => {
      el.removeEventListener("touchstart", onTouchStart, opts);
      el.removeEventListener("touchmove", onTouchMove, opts);
      el.removeEventListener("touchend", onTouchEnd, opts);
      el.removeEventListener("wheel", onWheel, opts);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, onWheel]);

  const isZoomed = scale > 1;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        touchAction: "none",
        cursor: isZoomed ? "grab" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        className="car-viewer-inner"
        style={{
          position: "absolute",
          top: "56px",
          bottom: "40px",
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "calc(100% - 120px)",
          maxWidth: "740px",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isZoomed ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      >
        {isInterior ? (
          <img
            key={interiorSrc}
            src={interiorSrc}
            alt="Car Interior"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        ) : (
          /* ── EXTERIOR: Smart single image crossfade fallback ── */
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#ffffff", 
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Eski Resim (Altta kalır) */}
            <img
              src={prevExteriorImage}
              alt="Previous Car Exterior"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
                transform: "scale(1.25)",
                opacity: 1, /* Alttaki resim her zaman sabit, şeffaflaşıp arka planı göstermez */
              }}
            />
            {/* Yeni Resim (Üstte, yavaşça belirir) */}
            <img
              src={currentExteriorImage}
              alt="Car Exterior"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transform: "scale(1.25)",
                pointerEvents: "none",
                opacity: isFading ? 0 : 1,
                transition: isFading ? "none" : "opacity 1.0s ease-in-out",
              }}
            />
          </div>
        )}
      </div>

      {isZoomed && (
        <>
          <button
            onClick={() => applyTransform(1, { x: 0, y: 0 })}
            style={{
              position: "absolute", top: "20px", right: "20px", zIndex: 20,
              background: "rgba(0,0,0,0.75)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px", color: "white",
              fontSize: "11px", padding: "8px 16px",
              cursor: "pointer", fontFamily: "inherit",
              letterSpacing: "0.06em", backdropFilter: "blur(10px)",
              textTransform: "uppercase", fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            Sıfırla ↺
          </button>
          <div style={{
            position: "absolute", bottom: "20px", right: "20px", zIndex: 20,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px", color: "rgba(255,255,255,0.5)",
            fontSize: "10px", padding: "4px 8px",
            fontFamily: "monospace",
          }}>
            {Math.round(scale * 100)}%
          </div>
        </>
      )}
    </div>
  );
}
