import React from "react";

export function Avatar({ index, size = 28 }) {
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
}
