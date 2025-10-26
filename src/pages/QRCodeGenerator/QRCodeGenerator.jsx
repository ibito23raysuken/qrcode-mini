import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Fonction pour imprimer l'élément référencé
export const printElement = (ref) => {
  if (!ref.current) return;

  // 🔹 Clone du contenu pour ne pas modifier la version à l’écran
  const clone = ref.current.cloneNode(true);

  // 🔹 Convertir tous les canvas (QR codes) en images
  const canvases = ref.current.querySelectorAll("canvas");
  const imgs = clone.querySelectorAll("canvas");

  canvases.forEach((canvas, i) => {
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.style.width = "100px";
    img.style.height = "100px";
    imgs[i].replaceWith(img);
  });

  // 🔹 Ouvrir la fenêtre d’impression
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>QR Codes</title>
        <style>
          body {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          div {
            text-align: center;
          }
          p {
            margin-top: 5px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>${clone.innerHTML}</body>
    </html>
  `);

  printWindow.document.close();

  // 🕒 Attend que la fenêtre ait fini de charger avant d’imprimer
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};


const QRCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef();

  // 🔹 Appel Apps Script pour récupérer les liens
  const fetchSheets = async (numbersString) => {
    setLoading(true);
    setError("");
    try {
      console.log("📡 Requête :", numbersString);

      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbypp5ZxwEp-KqbHBqCuumiPuhIrzRL6u0_ITzW4jeIKMS6tofNuYhPWcaYMPPk-ZGyk/exec?numbersParam=${encodeURIComponent(
          numbersString
        )}&mode=get`
      );

      const data = await response.json();
      console.log("📩 Réponse :", data);

      if (!data.success) throw new Error(data.error || "Erreur Apps Script");

      // Transforme le tableau en format pour QR Codes
      return data.data;
    } catch (err) {
      console.error("Erreur réseau :", err);
      setError(String(err));
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Génération des QR Codes
  const generateQRCodes = async () => {
    if (!input) return;
    const numbersString = input.trim(); // ex: "8-9;20-25;5"
    const sheetsArray = await fetchSheets(numbersString);
    console.log("📘 Sheets Array :", sheetsArray);
    setQrCodes(sheetsArray); // 🔹 Met à jour l'état pour afficher les QR Codes
  };

  return (
<div
  style={{
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  }}
>
  {/* Input + bouton */}
  <div
    style={{
      width: "400px",
      maxWidth: "90%",
      padding: "30px 25px",
      borderRadius: "15px",
      backgroundColor: "#fff",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      textAlign: "center",       // responsive
    }}
  >
    <h1 style={{ color: "#1877f2", marginBottom: "15px", width: "100%", textAlign: "center" }}>
      Générateur de Code QR
    </h1>

   <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", width: "100%", maxWidth: "400px" }}>
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ex: 1-10;20;30"
    style={{
      padding: "8px 12px",   // padding gauche/droite
      flex: "1 1 150px",     // grow/shrink
      minWidth: "150px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      paddingLeft: "10px",   // correction
      boxSizing: "border-box",
    }}
  />
  <button
    onClick={generateQRCodes}
    style={{
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.2s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
  >
    Générer
  </button>
</div>

  </div>

  {/* Messages */}
  {loading && <p>Chargement des feuilles...</p>}
  {error && <p style={{ color: "red" }}>{error}</p>}

  {/* QR Codes */}
  {qrCodes.length > 0 && (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "600px",
        boxSizing: "border-box",
      }}
      ref={printRef}
    >
      {qrCodes.map((qr, idx) => (
        <div
          key={idx}
          style={{
            textAlign: "center",
            border: "1px solid #000",
            width: "70px",
            height: "70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            pageBreakInside: "avoid",
          }}
        >
          <QRCodeCanvas
            value={qr.url}
            size={60}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
          />
          <p style={{ fontSize: "6px", marginTop: "2px" }}>{qr.name}</p>
        </div>
      ))}
    </div>
  )}

  {/* Bouton Impression */}
  {qrCodes.length > 0 && (
    <button
      onClick={() => printElement(printRef)}
      style={{
        marginTop: "20px",
        padding: "10px 18px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e7e34")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
    >
      Imprimer tous les QR Codes
    </button>
  )}
</div>


  );
};

export default QRCodeGenerator;
