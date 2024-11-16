import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Home</Link>
        <Link className="nav-link" to="/mqtt-control">MQTT 4-Channel Relay</Link>
      </div>
    </nav>
  );
}

export default NavBar;