import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const lampSize = 200;
  const lampCount = 10;
  const sidebarWidth = 250;
  
  // Calcul des dimensions pour les lampes sur toute la fenêtre
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const lamps = [];
  const gapX = windowWidth / lampCount;
  const gapY = windowHeight / (lampCount / 2);

  for (let i = 0; i < lampCount; i++) {
    const x = i * gapX;
    const y = (i % 2) * gapY + gapY / 4;
    lamps.push({
      left: x,
      top: y,
      rotate: Math.random() * 360 - 180,
      opacity: 0.15 + Math.random() * 0.1,
    });
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar fixe */}
      <Sidebar />

      {/* Contenu principal */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          padding: "20px",
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`
        }}
      >
        {/* Fond lampes - positionné sur toute la fenêtre */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {lamps.map((lamp, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
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

        {/* Contenu réel centré */}
        <div style={{
          
          position: "relative", 
          zIndex: 1, 
          width: "100%", 
          maxWidth: "500px",
          alignItems: "center"
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;