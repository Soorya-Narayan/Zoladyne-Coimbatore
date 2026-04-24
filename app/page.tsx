"use client";

import useSWR from "swr";
import { PowerFlowDiagram } from "@/components/PowerFlowDiagram";
import { KpiCards } from "@/components/KpiCards";
import { TrendChart } from "@/components/TrendChart";
import { LiveParams } from "@/components/LiveParams";
import { Navbar } from "@/components/Navbar";
import {
  mapItemsToDataPoints,
  mapLatestToKpis,
} from "@/lib/energy/mappers";
import type { EnergyItem } from "@/lib/energy/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const POLL_INTERVAL_MS = 30_000;

export default function DashboardPage() {
  const { data: trendData, isLoading: trendLoading } = useSWR<{
    items: EnergyItem[];
  }>("/api/energy?points=200", fetcher, {
    refreshInterval: POLL_INTERVAL_MS,
  });

  const { data: latestData, isLoading: latestLoading } = useSWR<{
    item: EnergyItem | null;
  }>("/api/energy/latest", fetcher, {
    refreshInterval: POLL_INTERVAL_MS,
  });

  const { data: healthData } = useSWR<{ mode?: string }>("/api/health", fetcher);

  const items = trendData?.items ?? [];
  const latest = latestData?.item ?? null;
  const energyData = mapItemsToDataPoints(items);
  const topKpis = mapLatestToKpis(latest);
  const loading = trendLoading || latestLoading;

  return (
    <main className="dashboard">
      <Navbar mode={healthData?.mode} />

      <KpiCards kpis={topKpis} loading={loading} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <PowerFlowDiagram kpis={topKpis} loading={loading} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginBottom: '1.5rem' }}>
            <TrendChart data={energyData} loading={loading} />
          </div>
          <div>
            <LiveParams latest={latest} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}
