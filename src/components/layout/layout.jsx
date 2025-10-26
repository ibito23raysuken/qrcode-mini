// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";

const Layout = () => {
  const lampSize = 200; 
  const lampCount = 10; 
  const sidebarWidth = 250; // largeur du sidebar
  const mainWidth = window.innerWidth - sidebarWidth;
  const mainHeight = window.innerHeight;

  const lamps = [];

  // Placer les lampes de façon régulière horizontalement et verticalement
  const gapX = mainWidth / lampCount;
  const gapY = mainHeight / (lampCount / 2);

  for (let i = 0; i < lampCount; i++) {
    const x = sidebarWidth + i * gapX;
    const y = (i % 2) * gapY + gapY / 4; // alterner verticalement pour éviter chevauchement

    lamps.push({
      left: x,
      top: y,
      rotate: Math.random() * 360 - 180, // rotation aléatoire
      opacity: 0.15 + Math.random() * 0.1,
    });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
 

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#F0F8FF",
          padding: "100px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fond lampes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {lamps.map((lamp, index) => (
            <div
              key={index}
              style={{
                top: lamp.top,
                left: lamp.left,
                fontSize: lampSize,
                transform: `rotate(${lamp.rotate}deg)`,
                color: `rgba(255, 255, 255, ${lamp.opacity})`,
              }}
            >
              💡
            </div>
          ))}
        </div>
     <Sidebar />
        {/* Contenu */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
