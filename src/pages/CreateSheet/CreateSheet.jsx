import React, { useState } from "react";

const CreateSheet = () => {
  const [startNumber, setStartNumber] = useState("");
  const [count, setCount] = useState(1);
  const [createdSheets, setCreatedSheets] = useState([]);

  const handleCreateSheets = async () => {
    const sheets = [];

    for (let i = 0; i < count; i++) {
      // Générer le numéro de feuille avec 4 chiffres
      const num = String(Number(startNumber) + i).padStart(4, "0");
      const sheetName = `KS_${num}`;

      try {
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbypp5ZxwEp-KqbHBqCuumiPuhIrzRL6u0_ITzW4jeIKMS6tofNuYhPWcaYMPPk-ZGyk/exec?sheetName=${sheetName}`
        );
        const data = await response.json();
        sheets.push({ name: sheetName, url: data.url });
      } catch (error) {
        console.error("Erreur lors de la création de la feuille :", error);
      }
    }

    setCreatedSheets(sheets);
    alert(`Feuilles créées : ${sheets.map(s => s.name).join(", ")}`);
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h1>Créer une nouvelle feuille</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Numéro de départ :{" "}
          <input
            type="number"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            placeholder="ex: 0032"
          />
        </label>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Nombre de feuilles à créer :{" "}
          <input
            type="number"
            value={count}
            min="1"
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={handleCreateSheets} style={{ padding: "10px 20px" }}>
        Créer la feuille(s)
      </button>

      {createdSheets.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Feuilles créées :</h3>
          <ul>
            {createdSheets.map((sheet, index) => (
              <li key={index}>
                <a href={sheet.url} target="_blank" rel="noreferrer">
                  {sheet.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateSheet;
