"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleHardNavigation = (url) => {
    window.location.href = url; 
  };

  return (
    <div>
      <div className="navbar mt-10">
        <div className="logo">STICK IT</div>
        <div className="menu-icon" onClick={toggleMenu} style={{ cursor: "pointer" }}>
          ☰
        </div>
        <div className={`links ${menuOpen ? "active" : "mr-32"}`}>
          {/* Replace Link components with hard navigation */}
          <a style={{ cursor: "pointer" }} onClick={() => handleHardNavigation("/")}>Home</a>
          <a style={{ cursor: "pointer" }} onClick={() => handleHardNavigation("/instructions")}>Instructions</a>
          <a style={{ cursor: "pointer" }} onClick={() => handleHardNavigation("/register")}>Register</a>
        </div>
      </div>
    </div>
  );
}
