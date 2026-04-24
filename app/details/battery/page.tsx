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

export default function BatteryDetailsPage() {
  const { data, isLoading } = useSWR<{ items: EnergyItem[] }>(
    "/api/energy?points=200",
    fetcher,
    { refreshInterval: POLL_INTERVAL_MS }
  );

  const items = data?.items || [];
  const latest = items.length > 0 ? items[items.length - 1] : null;
  const currentVoltage = latest?.payload?.battery_voltage || 0;

  const chartData = items.map((d) => ({
    time: formatTime(d.payload?.time || new Date(d.timestamp || parseInt(d.SK, 10)).toISOString()),
    batteryVoltage: d.payload?.battery_voltage || 0,
  }));

  // Calculate Min/Max/Avg for the dataset
  const validVoltages = chartData.map(d => d.batteryVoltage).filter(v => v > 0);
  const minV = validVoltages.length > 0 ? Math.min(...validVoltages) : 0;
  const maxV = validVoltages.length > 0 ? Math.max(...validVoltages) : 0;
  const avgV = validVoltages.length > 0 ? validVoltages.reduce((a,b) => a+b, 0) / validVoltages.length : 0;

  return (
    <div className="dashboard">
      <Navbar mode="live" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Battery Analytics</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Detailed view of energy storage system voltage and bounds.
        </p>

        {isLoading ? (
          <div className="params-skeleton" />
        ) : (
          <>
            <div className="kpi-cards">
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-battery)' }}>
                <span className="kpi-label">Current Voltage</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{currentVoltage.toFixed(1)} V</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-battery)' }}>
                <span className="kpi-label">Average Voltage</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{avgV.toFixed(1)} V</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-battery)' }}>
                <span className="kpi-label">Max Voltage (Peak)</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{maxV.toFixed(1)} V</span>
              </div>
              <div className="kpi-card" style={{ borderLeftColor: 'var(--accent-battery)' }}>
                <span className="kpi-label">Min Voltage (Dip)</span>
                <span className="kpi-value" style={{ fontSize: '1.5rem' }}>{minV.toFixed(1)} V</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <ParameterChart 
                title="Battery Voltage"
                dataKey="batteryVoltage"
                color="var(--accent-battery)"
                data={chartData}
                unit="V"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
