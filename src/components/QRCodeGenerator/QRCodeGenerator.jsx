import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export const printElement = (ref) => {
  if (!ref.current) return;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<html><head><title>QR Codes</title></head><body>`);
  printWindow.document.write(ref.current.innerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};

const QRCodeGenerator = () => {
  const [input, setInput] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef();

  const fetchSheets = async (startNumber, count) => {
    setLoading(true);
    setError("");
    try {

      const response = `https://script.google.com/macros/s/1afja9UmS6I8UADI-i2Mz49Cp4tLH3aG98dDUAyhHqr0/exec?startNumber=${startNumber}&count=${count}`;
      const data = await response.text();
      console.log(data); //
      if (!data.success) throw new Error(data.error || "Erreur Apps Script");
      // Map pour accès rapide
      const map = {};
      data.created.forEach(s => map[s.name] = s.url);
      return map;
    } catch (err) {
      setError(String(err));
      return {};
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodes = async () => {
    if (!input) return;
    const segments = input.split(";").map(s => s.trim()).filter(s => s);
    const allNumbers = [];

    // Créer la liste complète des numéros
    segments.forEach(seg => {
      if (seg.includes("-")) {
        const [start, end] = seg.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) allNumbers.push(i);
        }
      } else {
        const num = parseInt(seg);
        if (!isNaN(num)) allNumbers.push(num);
      }
    });

    if (allNumbers.length === 0) return;

    // Récupérer toutes les feuilles nécessaires d'un coup
    const min = Math.min(...allNumbers);
    const max = Math.max(...allNumbers);
    const sheetMap = await fetchSheets(min, max - min + 1);

    const codes = allNumbers.map(num => {
      const sheetName = `KS_${String(num).padStart(4, "0")}`;
      const url = sheetMap[sheetName];
      if (url) return { name: sheetName, link: url };
      return null;
    }).filter(Boolean);

    setQrCodes(codes);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Générateur de QR Codes</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ex: 1-10;20;30"
          style={{ padding: "8px", width: "300px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button onClick={generateQRCodes} style={{
          marginLeft: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "#fff",
          border: "none", borderRadius: "5px", cursor: "pointer"
        }}>Générer</button>
      </div>

      {loading && <p>Chargement des feuilles...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {qrCodes.length > 0 && (
        <>
          <div ref={printRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            {qrCodes.map((qr, idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <QRCodeCanvas value={qr.link} size={100} includeMargin={true} level="H" />
                <p style={{ marginTop: "5px" }}>{qr.name}</p>
              </div>
            ))}
          </div>
          <button onClick={() => printElement(printRef)} style={{
            marginTop: "20px", padding: "8px 16px", backgroundColor: "#28a745", color: "#fff",
            border: "none", borderRadius: "5px", cursor: "pointer"
          }}>Imprimer tous les QR Codes</button>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
