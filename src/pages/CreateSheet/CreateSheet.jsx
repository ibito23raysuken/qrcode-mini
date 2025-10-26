import React, { useState } from "react";

// 🔹 Composant Modal réutilisable
const Modal = ({ show, title, children, onClose }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "450px",
          maxWidth: "90%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#1877f2" }}>{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

// 🔹 Composant principal
const CreateSheet = () => {
  const [startNumber, setStartNumber] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbypp5ZxwEp-KqbHBqCuumiPuhIrzRL6u0_ITzW4jeIKMS6tofNuYhPWcaYMPPk-ZGyk/exec";

  const handleCreateSheets = async () => {
    if (!startNumber) {
      setModalContent(<div>⚠️ Veuillez entrer un numéro de départ.</div>);
      return;
    }

    setLoading(true);
    try {
      const url = `${SCRIPT_URL}?startNumber=${startNumber}&count=${count}&mode=create`;
      console.log("📡 Requête :", `${SCRIPT_URL}?startNumber=${startNumber}&count=${count}&mode=create`);

      const response = await fetch(url);
      const data = await response.json();
      console.log("📡 Requête :", data);
      if (data.success) {
        const createdList = (data.created || []).map((s) => (
          <li key={s.name}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.name}
            </a>
          </li>
        ));

        const existsList = (data.exists || []).map((s) => (
          <li key={s.name}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.name}
            </a>
          </li>
        ));

        const errorList = (data.errors || []).map((e) => (
          <li key={e.name}>
            <strong>{e.name}</strong> : {e.error}
          </li>
        ));

        setModalContent(
          <div style={{ textAlign: "left" }}>
            {createdList.length > 0 && (
              <>
                <h4 style={{ color: "green" }}>✅ Feuilles créées :</h4>
                <ul>{createdList}</ul>
              </>
            )}

            {existsList.length > 0 && (
              <>
                <h4 style={{ color: "#f39c12" }}>⚠️ Déjà existantes :</h4>
                <ul>{existsList}</ul>
              </>
            )}

            {errorList.length > 0 && (
              <>
                <h4 style={{ color: "red" }}>❌ Erreurs :</h4>
                <ul>{errorList}</ul>
              </>
            )}

            {createdList.length === 0 &&
              existsList.length === 0 &&
              errorList.length === 0 && (
                <div>Aucune feuille créée.</div>
              )}
          </div>
        );
      } else {
        console.log("📡 Requête :", data);
        setModalContent(<div>Erreur : {data.error}</div>);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setModalContent(
        <div>Erreur réseau, vérifie ton Apps Script et sa publication.</div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "50px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1877f2" }}>Créer des Feuilles Google Sheets</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Numéro de départ :{" "}
          <input
            type="number"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            placeholder="ex: 45"
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100px",
              textAlign: "center",
            }}
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
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "60px",
              textAlign: "center",
            }}
          />
        </label>
      </div>

      <button
        onClick={handleCreateSheets}
        style={{
          padding: "10px 20px",
          backgroundColor: "#1877f2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        disabled={loading}
      >
        {loading ? "Création en cours..." : "Créer la(les) feuille(s)"}
      </button>

      <Modal
        show={!!modalContent}
        title="Résultat de la création"
        onClose={() => setModalContent(null)}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default CreateSheet;
