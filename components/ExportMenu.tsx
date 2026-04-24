"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportMenuProps {
  title?: string;
}

export function ExportMenu({ title = "Zoladyne Energy Report" }: ExportMenuProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Default to last 24 hours
  const [startDateTime, setStartDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 24);
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    return new Date().toISOString().slice(0, 16);
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchExportData() {
    const startMs = new Date(startDateTime).getTime();
    const endMs = new Date(endDateTime).getTime();
    
    if (isNaN(startMs) || isNaN(endMs)) {
      alert("Invalid date range");
      return null;
    }
    
    setIsExporting(true);
    try {
      const res = await fetch(`/api/energy/export?startMs=${startMs}&endMs=${endMs}`);
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      return data.items;
    } catch (e) {
      alert("Failed to fetch export data");
      return null;
    } finally {
      setIsExporting(false);
    }
  }

  function formatData(items: any[]) {
    return items.map((item) => {
      const payload = item.payload || {};
      const date = new Date(item.timestamp || parseInt(item.SK, 10)).toLocaleString();
      return {
        Timestamp: date,
        "Solar (kW)": payload.solar_kw || 0,
        "Load (kW)": payload.load?.Kw || 0,
        "Grid (kW)": payload.in?.Kw || 0,
        "Battery (V)": payload.battery_voltage || 0,
      };
    });
  }

  async function exportCSV() {
    const items = await fetchExportData();
    if (!items || items.length === 0) return alert("No data found for this period");

    const formatted = formatData(items);
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Zoladyne_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsOpen(false);
  }

  async function exportExcel() {
    const items = await fetchExportData();
    if (!items || items.length === 0) return alert("No data found for this period");

    const formatted = formatData(items);
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Energy Data");
    XLSX.writeFile(workbook, `Zoladyne_Export_${Date.now()}.xlsx`);
    setIsOpen(false);
  }

  async function exportPNG() {
    setIsExporting(true);
    try {
      const chartEl = document.querySelector('.chart-container') as HTMLElement;
      if (!chartEl) throw new Error("Chart not found");
      const canvas = await html2canvas(chartEl, { backgroundColor: getComputedStyle(document.body).backgroundColor });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Zoladyne_Chart_${Date.now()}.png`;
      link.click();
    } catch(e) {
      alert("Failed to export PNG");
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  }

  async function exportPDF() {
    setIsExporting(true);
    try {
      // Fetch data for the table
      const items = await fetchExportData();
      if (!items || items.length === 0) throw new Error("No data found for this period");
      const formatted = formatData(items);

      // Capture the chart
      const chartEl = document.querySelector('.chart-container') as HTMLElement;
      if (!chartEl) throw new Error("Chart not found");
      const canvas = await html2canvas(chartEl, { backgroundColor: getComputedStyle(document.body).backgroundColor });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 40;
      const maxWidth = pageWidth - (margin * 2);
      const ratio = canvas.width / canvas.height;
      const imgWidth = maxWidth;
      const imgHeight = maxWidth / ratio;
      
      pdf.setFontSize(16);
      pdf.text(title, margin, margin);
      
      // Add the chart image below title
      const chartY = margin + 20;
      pdf.addImage(imgData, 'PNG', margin, chartY, imgWidth, imgHeight);

      // Add the data table using autoTable
      const tableHeaders = Object.keys(formatted[0]);
      const tableData = formatted.map(row => Object.values(row).map(String));
      
      autoTable(pdf, {
        head: [tableHeaders],
        body: tableData,
        startY: chartY + imgHeight + 20, // Start table below the chart
        margin: { top: margin, bottom: margin, left: margin, right: margin },
        styles: { fontSize: 8 },
        headStyles: { fillColor: [40, 40, 40] }
      });

      pdf.save(`Zoladyne_Report_${Date.now()}.pdf`);
    } catch(e) {
      alert("Failed to export PDF: " + String(e));
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="menu-container" ref={menuRef} data-html2canvas-ignore="true">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="mode-badge"
        style={{ cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-elevated)', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Export Data"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu" style={{ right: 0, left: 'auto', padding: '1rem', minWidth: '250px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Time Period</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From</label>
              <input 
                type="datetime-local" 
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                style={{ width: '100%', padding: '0.25rem', background: 'var(--bg-dark)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To</label>
              <input 
                type="datetime-local" 
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                style={{ width: '100%', padding: '0.25rem', background: 'var(--bg-dark)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '4px' }}
              />
            </div>
          </div>
          
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Export Data</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={exportCSV} disabled={isExporting} className="mode-badge" style={{ cursor: 'pointer' }}>
              {isExporting ? '...' : 'CSV'}
            </button>
            <button onClick={exportExcel} disabled={isExporting} className="mode-badge" style={{ cursor: 'pointer' }}>
              {isExporting ? '...' : 'Excel'}
            </button>
          </div>

          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Export Chart View</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button onClick={exportPNG} disabled={isExporting} className="mode-badge" style={{ cursor: 'pointer' }}>
              {isExporting ? '...' : 'PNG'}
            </button>
            <button onClick={exportPDF} disabled={isExporting} className="mode-badge" style={{ cursor: 'pointer' }}>
              {isExporting ? '...' : 'PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
