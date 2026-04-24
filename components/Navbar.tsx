"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  mode?: string;
}

export function Navbar({ mode }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left" style={{ gap: '0.5rem' }}>
        <div className="menu-container" ref={menuRef}>
          <button 
            className="menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              <Link href="/" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                Dashboard Home
              </Link>
              <Link href="/details/solar" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                Solar Details
              </Link>
              <Link href="/details/grid" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                Grid Details
              </Link>
              <Link href="/details/battery" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                Battery Details
              </Link>
              <Link href="/details/load" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                Load Details
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-center" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h1 
          style={{ cursor: 'pointer', margin: 0 }} 
          onClick={() => window.location.reload()}
          title="Refresh Dashboard"
        >
          Zoladyne
        </h1>
      </div>

      <div className="navbar-right">
        <span className="mode-badge">
          {mode === "synthetic" ? "Synthetic" : "Live"}
        </span>
        <ThemeToggle />
      </div>
    </nav>
  );
}
