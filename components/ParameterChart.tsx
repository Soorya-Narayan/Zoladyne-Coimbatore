"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ExportMenu } from "./ExportMenu";

interface ParameterChartProps {
  title: string;
  dataKey: string;
  color: string;
  data: any[];
  unit: string;
}

export function ParameterChart({ title, dataKey, color, data, unit }: ParameterChartProps) {
  return (
    <div className="chart-container" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>{title} Trend</h3>
        <ExportMenu title={`${title} Report`} />
      </div>
      
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
              labelStyle={{ color: "var(--text)" }}
              itemStyle={{ color: "var(--text)" }}
              formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, title]}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              name={title} 
              stroke={color} 
              dot={false} 
              strokeWidth={3} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
