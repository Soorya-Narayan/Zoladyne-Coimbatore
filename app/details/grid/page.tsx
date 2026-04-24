"use client";

import useSWR from "swr";
import { Navbar } from "@/components/Navbar";
import { ParameterChart } from "@/components/ParameterChart";
import type { EnergyItem } from "@/lib/energy/types";

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

export default function GridDetailsPage() {
  const { data, isLoading } = useSWR<{ items: EnergyItem[] }>(
    "/api/energy?points=200",
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  const items = data?.items || [];
  const latest = items.length > 0 ? items[items.length - 1] : null;
  const grid = latest?.payload?.in || {};

  const chartData = items.map((d) => ({
    time: formatTime(d.payload?.time || new Date(d.timestamp || parseInt(d.SK, 10)).toISOString()),
    gridKw: d.payload?.in?.Kw || 0,
  }));

  return (
    <div className="dashboard">
      <Navbar mode="live" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Grid Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Detailed breakdown of grid power consumption, phase voltages, and power quality metrics.
        </p>

        {isLoading ? (
          <div className="params-skeleton" />
        ) : (
          <>
            <div className="kpi-cards">
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Active Power</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(grid.Kw || 0).toFixed(2)} kW</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Apparent Power</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(grid.KVA || 0).toFixed(2)} kVA</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Power Factor</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(grid.pfAvg || 0).toFixed(2)}</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Avg Voltage</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(grid.Vavg || 0).toFixed(1)} V</span>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Phase Details</h3>
            <div className="kpi-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Phase L1</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(grid.Vr || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(grid.Il1 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Phase L2</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(grid.Vy || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(grid.Il2 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-grid)' }}>
                <span className="kpi-label">Phase L3</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(grid.Vb || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(grid.Il3 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <ParameterChart 
                title="Grid Power"
                dataKey="gridKw"
                color="var(--accent-grid)"
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
