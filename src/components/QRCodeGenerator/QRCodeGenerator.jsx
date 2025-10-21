import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { printElement } from "../../utils/printUtils";

const QRCodeGenerator = ({ value = "https://faniry.com" }) => {
  const printRef = useRef();

  const handlePrint = () => {
    printElement(printRef);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={printRef}>
        <QRCodeCanvas
          value={value}
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
};

export default QRCodeGenerator;
