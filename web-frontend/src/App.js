import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MQTTControl from "./MQTTControl";
import NavBar from "./components/navbax"; // Import your NavBar component

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<h2>Welcome to the Home Page</h2>} />
            <Route path="/mqtt-control" element={<MQTTControl />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
