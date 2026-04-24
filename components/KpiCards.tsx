"use client";

import type { TopKpis } from "@/lib/energy/types";
import Link from "next/link";

interface KpiCardsProps {
  kpis: TopKpis;
  loading?: boolean;
}

const cards: {
  key: keyof TopKpis;
  label: string;
  unit: string;
  color: string;
  format?: (v: number) => string;
}[] = [
  { key: "solarKw", label: "Solar Output", unit: "kW", color: "var(--accent-solar)", route: "/details/solar" },
  { key: "loadKw", label: "Load", unit: "kW", color: "var(--accent-load)", route: "/details/load" },
  { key: "gridKw", label: "Grid", unit: "kW", color: "var(--accent-grid)", route: "/details/grid" },
  { key: "batteryVoltage", label: "Battery Voltage", unit: "V", color: "var(--accent-battery)", route: "/details/battery" },
  { key: "solarEfficiency", label: "Solar Efficiency", unit: "%", color: "var(--accent-solar)", format: (v) => v.toFixed(1) },
  { key: "peakLoad24h", label: "Peak Load (24h)", unit: "kW", color: "var(--accent-muted)" },
];

interface KpiCardItem {
  key: keyof TopKpis;
  label: string;
  unit: string;
  color: string;
  route?: string;
  format?: (v: number) => string;
}

export function KpiCards({ kpis, loading }: KpiCardsProps) {
  return (
    <div className="kpi-cards">
      {(cards as KpiCardItem[]).map(({ key, label, unit, color, format, route }) => {
        const val = kpis[key];
        const num = typeof val === "number" ? val : 0;
        const display = format ? format(num) : num.toFixed(2);
        
        const cardContent = (
          <div
            className="kpi-card"
            style={{ 
              "--card-accent": color,
              cursor: route ? 'pointer' : 'default',
              transition: 'transform 0.2s, box-shadow 0.2s',
            } as React.CSSProperties}
          >
            <span className="kpi-label">{label}</span>
            <span className="kpi-value">
              {loading ? "—" : `${display} ${unit}`}
            </span>
          </div>
        );

        if (route) {
          return (
            <Link key={key} href={route} style={{ flex: '1 1 180px', textDecoration: 'none' }}>
              {cardContent}
            </Link>
          );
        }

        return (
          <div key={key} style={{ flex: '1 1 180px' }}>
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}
