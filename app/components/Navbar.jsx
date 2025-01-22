"use client";

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
        {/* Make the logo clickable */}
        <div 
          className="logo" 
          style={{ cursor: "pointer" }} 
          onClick={() => handleHardNavigation("/")}
        >
          STICK IT
        </div>
        <div 
          className="menu-icon" 
          onClick={toggleMenu} 
          style={{ cursor: "pointer" }}
        >
          ☰
        </div>
        <div className={`links ${menuOpen ? "active" : "mr-32"}`}>
          <a style={{ cursor: "pointer" }} onClick={() => handleHardNavigation("/instructions")}>
            Instructions
          </a>
          <a style={{ cursor: "pointer" }} onClick={() => handleHardNavigation("/register")}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
    