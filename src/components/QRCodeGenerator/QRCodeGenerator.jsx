import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { printElement } from "../../utils/printUtils";

const QRCodeGenerator = () => {
  const [name, setName] = useState("KS-23");
  const [link, setLink] = useState("https://faniry.com");
  const printRef = useRef();

  const handlePrint = () => {
    printElement(printRef);
  };

  const qrValue = `${link}`; // contenu du QR code

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom (ex: KS-23)"
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Lien (ex: https://...)"
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div ref={printRef}>
        <QRCodeCanvas
          value={qrValue}
          size={100}
          includeMargin={true}
          level="H"
        />
        <p style={{ marginTop: "10px" }}>{name}</p>
      </div>

      <button
        onClick={handlePrint}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Imprimer QR
      </button>
    </div>
  );
};

export default QRCodeGenerator;
