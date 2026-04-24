"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { EnergyDataPoint } from "@/lib/energy/types";
import { ExportMenu } from "./ExportMenu";

interface TrendChartProps {
  data: EnergyDataPoint[];
  loading?: boolean;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function TrendChart({ data, loading }: TrendChartProps) {
  const [chartType, setChartType] = useState<"line" | "pie">("line");
  const [hiddenLines, setHiddenLines] = useState<string[]>([]);

  const toggleLine = (dataKey: string) => {
    setHiddenLines(prev => 
      prev.includes(dataKey) 
        ? prev.filter(k => k !== dataKey) 
        : [...prev, dataKey]
    );
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h3>Power Trend</h3>
        <div className="chart-skeleton" />
      </div>
    );
  }

  const chartData = data.map((d) => ({
    time: formatTime(d.time),
    solar: d.solarKw ?? 0,
    load: d.loadKw ?? 0,
    grid: d.gridKw ?? 0,
    battery: d.batteryVoltage ?? 0,
  }));

  const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const pieData = latestData
    ? [
        { name: "Solar", value: latestData.solar, color: "var(--accent-solar)" },
        { name: "Grid", value: latestData.grid, color: "var(--accent-grid)" },
        { name: "Load", value: latestData.load, color: "var(--accent-load)" },
      ].filter((d) => d.value > 0)
    : [];

  const totalPower = pieData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Power Trend</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ExportMenu />
          <button 
          data-html2canvas-ignore="true"
          onClick={() => setChartType(prev => prev === 'line' ? 'pie' : 'line')}
          className="mode-badge"
          style={{ cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-elevated)', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={chartType === 'line' ? 'View Pie Chart' : 'View Line Chart'}
        >
          {chartType === 'line' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          )}
        </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 280 }}>
        {/* Line Chart */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: chartType === 'line' ? 1 : 0, 
          visibility: chartType === 'line' ? 'visible' : 'hidden',
          transition: 'opacity 0.4s ease, visibility 0.4s ease'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
              <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "var(--text)" }}
              />
              <Legend 
                onClick={(e) => toggleLine(e.dataKey as string)}
                wrapperStyle={{ cursor: 'pointer' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="solar" name="Solar (kW)" stroke="var(--accent-solar)" dot={false} strokeWidth={2} hide={hiddenLines.includes("solar")} />
              <Line yAxisId="left" type="monotone" dataKey="load" name="Load (kW)" stroke="var(--accent-load)" dot={false} strokeWidth={3} hide={hiddenLines.includes("load")} />
              <Line yAxisId="left" type="monotone" dataKey="grid" name="Grid (kW)" stroke="var(--accent-grid)" dot={false} strokeWidth={3} hide={hiddenLines.includes("grid")} />
              <Line yAxisId="right" type="monotone" dataKey="battery" name="Battery (V)" stroke="var(--accent-battery)" dot={false} strokeWidth={2} strokeDasharray="5 5" hide={hiddenLines.includes("battery")} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: chartType === 'pie' ? 1 : 0, 
          visibility: chartType === 'pie' ? 'visible' : 'hidden',
          transition: 'opacity 0.4s ease, visibility 0.4s ease',
          display: 'flex', alignItems: 'center'
        }}>
          <div style={{ flex: 1, height: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                  itemStyle={{ color: "var(--text)" }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total kW</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{totalPower.toFixed(1)}</div>
            </div>
          </div>
          
          {/* Active Legend to fill right-side gap */}
          <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1rem' }}>
            {pieData.map((d) => (
              <div key={d.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{d.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{d.value.toFixed(2)}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({totalPower > 0 ? ((d.value / totalPower) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
