# Zoladyne Analytics Dashboard

A high-performance, real-time energy monitoring and analytics platform built with **Next.js 14**, **TypeScript**, and **DynamoDB**. This dashboard provides comprehensive visibility into solar generation, grid interaction, load demand, and battery health.


## Demo
<p align="center">
  <img src="https://github.com/user-attachments/assets/44ce3dee-0a98-4607-a7e8-afef32e8b9fe" width="30%" />
  <img src="https://github.com/user-attachments/assets/69becc04-47a4-4f4a-82c1-d2716b4ae09c" width="30%" />
  <img src="https://github.com/user-attachments/assets/9e01dfd0-73d6-48b0-ae7a-c3a508d86a4d" width="30%" />
</p>

## 🚀 Key Features

### 📊 Real-Time Visualization
- **Live Power Flow**: An animated, vertical SVG diagram visualizing the real-time flow of energy from Solar, Grid, and Battery sources into the Load.
- **Interactive Trends**: Hybrid Line/Pie chart views with dynamic legend toggling. Isolate individual parameters (Solar, Load, Grid, Battery) with a single click.
- **Smart KPI Cards**: Real-time status cards that expand evenly across the dashboard, featuring hover elevation and direct navigation to subsystem analytics.

### 🔍 Deep-Dive Analytics
Dedicated full-page views for every subsystem:
- **Solar Details**: String-level MPPT tracking (Voltage/Current per array) and daily yield analysis.
- **Grid Details**: Multi-phase electrical breakdown (L1/L2/L3) and voltage stability monitoring.
- **Load Details**: Demand analysis and peak usage tracking.
- **Battery Details**: Voltage health and discharge telemetry.

### 📥 Enterprise Reporting
Advanced data export engine supporting:
- **Multi-Format Exports**: Download any chart or data range in **CSV**, **Excel**, **PNG**, or **PDF**.
- **Branded Reports**: PDF exports are automatically titled and formatted for professional energy assessment reporting.

### 🎨 Premium UX/UI
- **Modern Dark Interface**: Built with a sleek, high-contrast dark theme (supports system-wide toggling).
- **Smooth Navigation**: Persistent floating home button and a dedicated SplashScreen loading state for seamless transition between analytics views.
- **Responsive Design**: Fluid layouts that adapt perfectly from large desktop monitors to tablets.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (Premium Custom Tokens)
- **Charts**: Recharts (Customized Components)
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Exports**: jsPDF, AutoTable, SheetJS (XLSX)
- **Database**: AWS DynamoDB

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account (for Live Data) or `USE_SYNTHETIC_DATA=1` (for Development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Soorya-Narayan/Zoladyne-Coimbatore.git
   cd zol-dash-nextjs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment:
   Create a `.env.local` file (see [Environment Variables](#environment-variables) below).
4. Run the development server:
   ```bash
   npm run dev
   ```

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `AWS_REGION` | AWS region for DynamoDB (e.g., `ap-south-1`) |
| `DDB_TABLE` | Name of your DynamoDB table |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key |
| `USE_SYNTHETIC_DATA` | Set to `1` to bypass AWS and use the internal mock telemetry engine |

## 🔗 API Endpoints

- `GET /api/energy`: Time-series data points for primary charts.
- `GET /api/energy/latest`: Fetches the most recent telemetry record.
- `GET /api/energy/export`: Dynamic endpoint for generating CSV/Excel/PDF reports.
- `GET /api/health`: System health and mode (Live/Synthetic) indicator.

---
*Powered by Zoladyne Energy Systems*
