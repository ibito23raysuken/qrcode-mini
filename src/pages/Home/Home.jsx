import React from "react";
import QRCodeGenerator from "../../Components/QRCodeGenerator/QRCodeGenerator";
const Home = () => {
  return (
    <div style={{ marginTop: "50px" }}>
      <h1 style={{ textAlign: "center" }}>Générateur de QR Code</h1>
      <QRCodeGenerator value="https://faniry.com" />
    </div>
  );
};

export default Home;
