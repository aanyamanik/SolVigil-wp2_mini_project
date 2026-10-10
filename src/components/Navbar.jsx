import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";


function Navbar() {
    return (
        <nav className = "navbar">
            <div className = "logo">
                ☀️ SolVigil
            </div>
            <div className = "nav-links">
                <Link to = "/">Dashboard</Link>
                <Link to = "/forecast">Forecast</Link>
                <Link to = "/map">Heat Map</Link>
                <Link to = "/alerts">Alerts</Link>
                <Link to = "/login">Login</Link>
            </div>
        </nav>
    );
}


export default Navbar;

