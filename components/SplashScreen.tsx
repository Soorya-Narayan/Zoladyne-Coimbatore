"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShow(true);
    setAnimateOut(false);
    
    // Start fading out at 800ms
    const timer1 = setTimeout(() => setAnimateOut(true), 800); 
    // Unmount at 1200ms
    const timer2 = setTimeout(() => setShow(false), 1200); 
    
    return () => { 
      clearTimeout(timer1); 
      clearTimeout(timer2); 
    };
  }, [pathname]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-dark)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: animateOut ? 0 : 1,
      transition: 'opacity 0.4s ease',
      pointerEvents: animateOut ? 'none' : 'auto'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--text)'
      }}>
        Zoladyne
      </h1>
    </div>
  );
}
