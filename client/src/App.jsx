import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./components/Lobby/Lobby";
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/codeblock/:id" element={<CodeBlockPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
