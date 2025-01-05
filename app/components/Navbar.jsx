"use client";

import '@/app/globals.css';
import Link from "next/link";
import { useState } from "react";


export default function Navbar(){


    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
    
    
    
      return (
        <div>
    
        <div className="navbar mt-10">
              <div className="logo">STICK IT</div>
              <div
                className="menu-icon"
                onClick={toggleMenu}
              >
                ☰
              </div>
              <div className= {`links ${menuOpen ? "active" : "mr-32"}`}>
                <Link href="/">Home</Link>
                <Link href="/instructions">Instructions</Link>
                <Link href="/register">Register</Link>
              </div>
            </div>
        </div>

            );


}