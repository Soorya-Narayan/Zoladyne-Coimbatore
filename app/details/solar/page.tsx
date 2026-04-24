"use client";

import useSWR from "swr";
import { Navbar } from "@/components/Navbar";
import { ParameterChart } from "@/components/ParameterChart";
import type { EnergyItem } from "@/lib/energy/types";
import { ReactElement } from "react";

const POLL_INTERVAL_MS = 60000;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function SolarDetailsPage() {
  const { data, isLoading } = useSWR<{ items: EnergyItem[] }>(
    "/api/energy?points=200",
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  const items = data?.items || [];
  const latest = items.length > 0 ? items[items.length - 1] : null;
  const p = latest?.payload;

  const chartData = items.map((d) => ({
    time: formatTime(d.payload?.time || new Date(d.timestamp || parseInt(d.SK, 10)).toISOString()),
    solarKw: d.payload?.solar_kw || 0,
  }));

  const mpptCards: ReactElement[] = [];
  if (p) {
    const v1 = p.data_1?.pv_voltage;
    const c1 = p.data_1?.pv_current;
    if (v1 && c1) {
      for (let i = 1; i <= 6; i++) {
        const key = `mppt${i}` as keyof typeof v1;
        if (v1[key] !== undefined || c1[key] !== undefined) {
          mpptCards.push(
            <div key={`mppt1-${i}`} className="kpi-card" style={{ borderLeftColor: 'var(--accent-solar)' }}>
              <span className="kpi-label">Array 1 - MPPT {i}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                  <div className="kpi-value">{(v1[key] || 0).toFixed(1)} V</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                  <div className="kpi-value">{(c1[key] || 0).toFixed(1)} A</div>
                </div>
              </div>
            </div>
          );
        }
      }
    }
  }

  return (
    <div className="dashboard">
      <Navbar mode="live" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Solar Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Detailed breakdown of photovoltaic generation, including array-level MPPT tracking and overall solar yield.
        </p>

        {isLoading ? (
          <div className="params-skeleton" />
        ) : (
          <>
            <div className="kpi-cards">
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-solar)' }}>
                <span className="kpi-label">Total Solar Power</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(p?.solar_kw || 0).toFixed(2)} kW</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-solar)' }}>
                <span className="kpi-label">Today's Yield</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(p?.today_solar_kwh || p?.KWH || 0).toFixed(1)} kWh</span>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>MPPT String Details</h3>
            <div className="kpi-cards">
              {mpptCards.length > 0 ? mpptCards : <p style={{ color: 'var(--text-muted)' }}>No MPPT data available.</p>}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <ParameterChart 
                title="Solar Generation"
                dataKey="solarKw"
                color="var(--accent-solar)"
                data={chartData}
                unit="kW"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
