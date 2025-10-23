import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateSheet from "./pages/CreateSheet/CreateSheet";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSheet />} />
      </Routes>
    </Router>
  );
}

export default App;
