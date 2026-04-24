"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingHomeButton() {
  const pathname = usePathname();
  
  if (pathname === "/") return null; // Don't show on dashboard home

  return (
    <Link 
      href="/" 
      title="Back to Dashboard"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 50,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'transform 0.2s ease, background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </Link>
  );
}
