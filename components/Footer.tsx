"use client";

export function Footer() {
  return (
    <footer style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: '3rem 0 2rem 0',
      opacity: 0.8,
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
      width: '100%',
    }}>
      <span>Powered by</span>
      <img 
        src="/company-logo.jpg" 
        alt="Company Logo" 
        style={{ 
          height: '28px', 
          width: 'auto', 
          filter: 'grayscale(0.5) contrast(1.2)', 
          transition: 'filter 0.3s ease',
          borderRadius: '4px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0) contrast(1)'}
        onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(0.5) contrast(1.2)'}
      />
    </footer>
  );
}
