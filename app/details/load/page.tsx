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

export default function LoadDetailsPage() {
  const { data, isLoading } = useSWR<{ items: EnergyItem[] }>(
    "/api/energy?points=200",
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  const items = data?.items || [];
  const latest = items.length > 0 ? items[items.length - 1] : null;
  const load = latest?.payload?.load || {};
  const maxDemand = latest?.payload?.max_demand_24h || 0;

  const chartData = items.map((d) => ({
    time: formatTime(d.payload?.time || new Date(d.timestamp || parseInt(d.SK, 10)).toISOString()),
    loadKw: d.payload?.load?.Kw || 0,
  }));

  return (
    <div className="dashboard">
      <Navbar mode="live" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Load Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Detailed breakdown of facility power consumption and phase balance.
        </p>

        {isLoading ? (
          <div className="params-skeleton" />
        ) : (
          <>
            <div className="kpi-cards">
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Active Power</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(load.Kw || 0).toFixed(2)} kW</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Apparent Power</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(load.KVA || 0).toFixed(2)} kVA</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Max Demand (24h)</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{maxDemand.toFixed(2)} kW</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Power Factor</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{(load.pfAvg || 0).toFixed(2)}</span>
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Phase Details</h3>
            <div className="kpi-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Phase L1</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(load.Vr || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(load.Il1 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Phase L2</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(load.Vy || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(load.Il2 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-load)' }}>
                <span className="kpi-label">Phase L3</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Voltage</div>
                    <div className="kpi-value">{(load.Vb || 0).toFixed(1)} V</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                    <div className="kpi-value">{(load.Il3 || 0).toFixed(1)} A</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <ParameterChart 
                title="Load Power"
                dataKey="loadKw"
                color="var(--accent-load)"
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
