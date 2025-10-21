import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @page { size: 1cm 1cm; margin: 0; }
            body { margin: 0; display: flex; justify-content: center; align-items: center; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div ref={printRef}>
        <QRCodeCanvas
          value="https://faniry.com" // le lien ou le texte à encoder
          size={37} // environ 1 cm
          includeMargin={false}
          level="H"
        />
      </div>
      <button onClick={handlePrint} style={{ marginTop: "20px" }}>
        Imprimer QR
      </button>
    </div>
  );
}

export default App;
