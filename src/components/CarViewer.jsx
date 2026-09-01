// src/components/CarViewer.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { getInteriorImage } from "../data/config";

const MIN_SCALE = 1;
const MAX_SCALE = 3;

// Klasördeki mevcut tüm render görsellerinin listesi
const AVAILABLE_FILES = [
  "black-base-bare.jpeg", "black-base-highfront-highrear.png", "black-base-highfront.png", "black-base-highrear.png", "black-base-lowfront-highrear.png", "black-base-lowfront-lowrear.png", "black-base-lowfront.jpeg", "black-base-lowrear.jpeg", "black-base-sidepod-highfront-highrear.png", "black-base-sidepod-highfront-lowrear.png", "black-base-sidepod-highfront.png", "black-base-sidepod-highrear.png", "black-base-sidepod-lowfront-highrear.png", "black-base-sidepod-lowfront-lowrear.png", "black-base-sidepod-lowfront.png", "black-base-sidepod-lowrear.png", "black-base-sidepod.jpeg", "black-base-sidepod.png", "black-braid-bare.jpg", "black-braid-highfront-highrear.png", "black-braid-highfront-lowrear.png", "black-braid-highfront.png", "black-braid-highrear.png", "black-braid-lowfront-highrear.png", "black-braid-lowfront-lowrear.png", "black-braid-lowfront.png", "black-braid-lowrear.png", "black-braid-sidepod-highfront.png", "black-braid-sidepod-highrear.png", "black-braid-sidepod-lowfront-highrear.png", "black-braid-sidepod-lowfront-lowrear.png", "black-braid-sidepod-lowfront.png", "black-braid-sidepod-lowrear.png", "black-oz-bare.jpg", "black-oz-highfront-highrear.png", "black-oz-highfront-lowrear.png", "black-oz-highfront.png", "black-oz-highrear.png", "black-oz-lowfront-highrear.png", "black-oz-lowfront-lowrear.png", "black-oz-lowfront.png", "black-oz-lowrear.png", "black-oz-sidepod-highfront-highrear.png", "black-oz-sidepod-highfront-lowrear.png", "black-oz-sidepod-highfront.png", "black-oz-sidepod-highrear.png", "black-oz-sidepod-lowfront-highrear.png", "black-oz-sidepod-lowfront-lowrear.png", "black-oz-sidepod-lowfront.png", "black-oz-sidepod-lowrear.png", "black-oz-sidepod.png", "Carbon-Fibre.png", "Composite-Suede.png", "red-base-bare.jpeg", "red-base-lowfront-lowrear.png", "red-base-lowfront.jpeg", "red-base-lowrear.jpeg", "red-base-sidepod-highfront.png", "red-base-sidepod-lowfront.png", "red-base-sidepod.jpeg", "red-base-sidepod.png", "red-braid-bare.jpg", "red-braid-highfront.png", "red-braid-lowfront.png", "red-braid-sidepod-highfront.png", "red-braid-sidepod-lowfront.png", "red-oz-bare.jpg", "red-oz-highfront.png", "red-oz-lowfront.png", "white-base-bare.jpeg", "white-base-highfront.png", "white-base-highrear.jpeg", "white-base-lowfront-highrear.png", "white-base-lowfront-lowrear.png", "white-base-lowfront.jpeg", "white-base-lowrear.jpeg", "white-base-sidepod-highfront-highrear.png", "white-base-sidepod-highfront-lowrear.png", "white-base-sidepod-highfront.png", "white-base-sidepod-highrear.png", "white-base-sidepod-lowfront-highrear.png", "white-base-sidepod-lowfront-lowrear.png", "white-base-sidepod-lowfront.png", "white-base-sidepod-lowrear.png", "white-base-sidepod.jpeg", "white-braid-bare.jpg", "white-braid-high-front.png", "white-braid-highfront-highrear.png", "white-braid-highfront-lowrear.png", "white-braid-highfront.png", "white-braid-highrear.png", "white-braid-low-front.png", "white-braid-lowfront-highrear.png", "white-braid-lowfront-lowrear.png", "white-braid-lowfront.png", "white-braid-lowrear.png", "white-braid-sidepod-highfront-highrear.png", "white-braid-sidepod-highfront-lowrear.png", "white-braid-sidepod-highfront.png", "white-braid-sidepod-highrear.png", "white-braid-sidepod-lowfront-highrear.png", "white-braid-sidepod-lowfront-lowrear.png", "white-braid-sidepod-lowfront.png", "white-braid-sidepod-lowrear.png", "white-braid-sidepod.png", "white-car.jpeg", "white-oz-bare.jpg", "white-oz-highfront-highrear.png", "white-oz-highfront-lowrear.png", "white-oz-highfront.jpg", "white-oz-highfront.png", "white-oz-highrear.png", "white-oz-low.png", "white-oz-lowfront-highrear.png", "white-oz-lowfront-lowrear.png", "white-oz-lowfront.png", "white-oz-lowrear.png", "white-oz-sidepod-highfront-highrear.png", "white-oz-sidepod-highfront-lowrear.png", "white-oz-sidepod-highfront.png", "white-oz-sidepod-highrear.png", "white-oz-sidepod-lowfront-highrear.png", "white-oz-sidepod-lowfront-lowrear.png", "white-oz-sidepod-lowfront.png", "white-oz-sidepod-lowrear.png", "white-oz-sidepod.png"
];

const findBestImage = (state) => {
  const c = state.color || 'white';
  const w = (!state.jant || state.jant === 'none') ? 'base' : state.jant;
  
  const hasSidepod = !!state.sidepod;
  const hasFront = state.frontWing && state.frontWing !== 'none';
  const hasRear = state.rearWing && state.rearWing !== 'none';

  const parts = [c, w];
  if (hasSidepod) parts.push('sidepod');
  
  if (hasFront) parts.push(state.frontWing + 'front'); // 'lowfront' or 'highfront'
  if (hasRear) parts.push(state.rearWing + 'rear');    // 'lowrear' or 'highrear'
  
  if (!hasSidepod && !hasFront && !hasRear) {
    parts.push('bare');
  }
  
  const exactName = parts.join('-'); // e.g. white-braid-sidepod-lowfront-lowrear

  // Find the exact match (ignoring extension)
  const match = AVAILABLE_FILES.find(file => file.toLowerCase().startsWith(exactName.toLowerCase() + '.'));

  return match ? `/assets/cars/${match}` : null;
};

export default function CarViewer({ state, activeSection }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentExteriorImage, setCurrentExteriorImage] = useState(`/assets/cars/white-base-car.jpeg`);
  const [prevExteriorImage, setPrevExteriorImage] = useState(`/assets/cars/white-base-car.jpeg`);
  const [isFading, setIsFading] = useState(false);

  const containerRef = useRef(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const lastDist = useRef(null);
  const lastMidpoint = useRef(null);
  const lastPan = useRef(null);
  const isDragging = useRef(false);

  const isInterior = activeSection === "koltuk" || activeSection === "direksiyon";
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
        style={{
          position: "absolute",
          inset: "40px 60px",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isZoomed ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
        }}
      >
        {isInterior ? (
          <img
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
          /* ── EXTERIOR: No-effect instant swap (as requested) ── */
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "transparent",
            }}
          >
            <img
              src={currentExteriorImage}
              alt="Current Car Exterior Configuration"
              draggable={false}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "auto",
                height: "100%",
                maxWidth: "none",
                pointerEvents: "none",
                transition: "all 0.3s ease-in-out",
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
