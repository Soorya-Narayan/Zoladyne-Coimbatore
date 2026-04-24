"use client";

import type { EnergyItem } from "@/lib/energy/types";

interface LiveParamsProps {
  latest: EnergyItem | null;
  loading?: boolean;
}

export function LiveParams({ latest, loading }: LiveParamsProps) {
  const p = latest?.payload;
  if (!p || loading) {
    return (
      <div className="live-params">
        <h3>Live Parameters</h3>
        <div className="params-skeleton" />
      </div>
    );
  }

  const load = p.load ?? {};
  const grid = p.in ?? {};

  const vAvg = typeof load.Vavg === "number" ? load.Vavg.toFixed(1) : "—";
  const pfAvg = typeof load.pfAvg === "number" ? load.pfAvg.toFixed(2) : "—";
  const i1 = typeof load.Il1 === "number" ? load.Il1.toFixed(1) : "—";
  const i2 = typeof load.Il2 === "number" ? load.Il2.toFixed(1) : "—";
  const i3 = typeof load.Il3 === "number" ? load.Il3.toFixed(1) : "—";
  const kva = typeof grid.KVA === "number" ? grid.KVA.toFixed(2) : "—";

  const batteryV = typeof p.battery_voltage === "number" ? p.battery_voltage.toFixed(1) : "—";
  const mppt1V = typeof p.data_1?.pv_voltage?.mppt1 === "number" ? p.data_1.pv_voltage.mppt1.toFixed(1) : "—";
  const mppt1A = typeof p.data_1?.pv_current?.mppt1 === "number" ? p.data_1.pv_current.mppt1.toFixed(1) : "—";
  const yieldKwh = typeof p.KWH === "number" ? p.KWH.toFixed(1) : "—";

  const params = [
    { label: "Vavg", value: vAvg, unit: "V" },
    { label: "Current (L1/L2/L3)", value: `${i1} / ${i2} / ${i3}`, unit: "A" },
    { label: "pfAvg", value: pfAvg, unit: "" },
    { label: "Grid KVA", value: kva, unit: "kVA" },
    { label: "Battery", value: batteryV, unit: "V" },
    { label: "MPPT 1 Volts", value: mppt1V, unit: "V" },
    { label: "MPPT 1 Current", value: mppt1A, unit: "A" },
    { label: "Daily Yield", value: yieldKwh, unit: "kWh" },
  ];

  return (
    <div className="live-params">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Live Parameters</h3>
        {p.time && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Updated: {new Date(p.time).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {params.map(({ label, value, unit }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 500 }}>{value}</span>
              {unit && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
