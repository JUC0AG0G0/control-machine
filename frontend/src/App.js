import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Background from "./pages/Background";
import Index from "./pages/Index";
import Exemple from "./pages/Exemple";

function App() {
  return (
    <Router>
      <div className="App h-screen">

        {/* Composant pour side bar responsive */}

        <Routes>
          <Route path="/background" element={<Background />} />
          <Route path="/exemple/" element={<Exemple />} />
          <Route path="/*" element={<Index />} />
        </Routes>



      </div>
    </Router>
  );
}

export default App;
