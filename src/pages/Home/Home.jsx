import React from "react";
import QRCodeGenerator from "../../components/QRCodeGenerator/QRCodeGenerator";

const Home = () => {
  return (
    <div style={{ marginTop: "50px" }}>
      <h1 style={{ textAlign: "center" }}>Générateur de QR Code</h1>
      <QRCodeGenerator />
    </div>
  );
};

export default Home;
