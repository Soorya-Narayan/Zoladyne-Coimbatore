"use client";

import type { TopKpis } from "@/lib/energy/types";

interface PowerFlowDiagramProps {
  kpis: TopKpis;
  loading?: boolean;
}

export function PowerFlowDiagram({ kpis, loading }: PowerFlowDiagramProps) {
  const { solarKw, gridKw, loadKw, batteryVoltage } = kpis;

  return (
    <div className="power-flow" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3>Power Flow</h3>
      {loading ? (
        <div className="power-flow-skeleton" style={{ flex: 1 }} />
      ) : (
        <div className="flow-grid" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', zIndex: 2, alignItems: 'center', flex: 1, justifyContent: 'space-between', padding: '2rem 0' }}>
          
          {/* Top Row: Sources */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
            <div className="flow-node solar" style={{ background: 'var(--bg-card)', zIndex: 10, flex: 1, textAlign: 'center', position: 'relative' }}>
              <span className="label">Solar</span>
              <span className="value">{solarKw.toFixed(2)} kW</span>
            </div>
            <div className="flow-node grid" style={{ background: 'var(--bg-card)', zIndex: 10, flex: 1, textAlign: 'center', position: 'relative' }}>
              <span className="label">Grid</span>
              <span className="value">{gridKw.toFixed(2)} kW</span>
            </div>
            <div className="flow-node battery" style={{ background: 'var(--bg-card)', zIndex: 10, flex: 1, textAlign: 'center', position: 'relative' }}>
              <span className="label">Battery</span>
              <span className="value">{batteryVoltage.toFixed(1)} V</span>
            </div>
          </div>

          {/* Bottom Row: Load */}
          <div style={{ width: '60%', minWidth: '200px' }}>
            <div className="flow-node load" style={{ background: 'var(--bg-card)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem', position: 'relative' }}>
              <span className="label">Load</span>
              <span className="value" style={{ fontSize: '1.5rem' }}>{loadKw.toFixed(2)} kW</span>
            </div>
          </div>

          {/* SVG Overlay for lines */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none', padding: '3rem 0' }}>
            <defs>
              <linearGradient id="grad-solar-v" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-solar)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent-load)" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-grid-v" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-grid)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent-load)" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="grad-battery-v" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-battery)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent-load)" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Static background lines */}
            <path d="M 16 10 C 16 50, 50 50, 50 90" fill="none" stroke="var(--border)" strokeWidth="0.5" />
            <path d="M 50 10 C 50 50, 50 50, 50 90" fill="none" stroke="var(--border)" strokeWidth="0.5" />
            <path d="M 84 10 C 84 50, 50 50, 50 90" fill="none" stroke="var(--border)" strokeWidth="0.5" />
            
            {/* Animated lines */}
            {solarKw > 0 && <path className="flow-anim" d="M 16 10 C 16 50, 50 50, 50 90" fill="none" stroke="url(#grad-solar-v)" strokeWidth="1" />}
            {gridKw > 0 && <path className="flow-anim" d="M 50 10 C 50 50, 50 50, 50 90" fill="none" stroke="url(#grad-grid-v)" strokeWidth="1" />}
            {batteryVoltage > 0 && <path className="flow-anim" d="M 84 10 C 84 50, 50 50, 50 90" fill="none" stroke="url(#grad-battery-v)" strokeWidth="1" />}
          </svg>

        </div>
      )}
    </div>
  );
}
