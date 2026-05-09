'use client';
import { useState, useEffect } from 'react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({ totalProducts: 0, totalInquiries: 0, totalCustomers: 0, pendingInquiries: 0, statusDistribution: [] as Array<{ status: string; count: number }>, categoryDistribution: [] as Array<{ name: string; count: number }> });

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const downloadCSV = () => {
    const rows = [['Metric', 'Value'], ['Total Products', String(stats.totalProducts)], ['Total Inquiries', String(stats.totalInquiries)], ['Total Customers', String(stats.totalCustomers)], ['Pending Inquiries', String(stats.pendingInquiries)]];
    stats.statusDistribution.forEach(s => rows.push([`Status: ${s.status}`, String(s.count)]));
    stats.categoryDistribution.forEach(c => rows.push([`Category: ${c.name}`, String(c.count)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'bpg-analytics.csv'; a.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="h2">Analytics & Reports</h1>
        <button onClick={downloadCSV} className="btn btn-secondary">📥 Download CSV</button>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Inquiry Pipeline</h3>
          {stats.statusDistribution.map(s => {
            const pct = stats.totalInquiries ? Math.round((s.count / stats.totalInquiries) * 100) : 0;
            return (
              <div key={s.status} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>{s.status}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.count} ({pct}%)</span>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 4, height: 12 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Equipment Inventory</h3>
          {stats.categoryDistribution.map(c => {
            const pct = stats.totalProducts ? Math.round((c.count / stats.totalProducts) * 100) : 0;
            return (
              <div key={c.name} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--secondary)' }}>{c.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.count} ({pct}%)</span>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 4, height: 12 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-light)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Summary Report</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Metric</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td>Total Products in Catalogue</td><td style={{ fontWeight: 600 }}>{stats.totalProducts}</td></tr>
              <tr><td>Total Inquiries Received</td><td style={{ fontWeight: 600 }}>{stats.totalInquiries}</td></tr>
              <tr><td>Registered Customers</td><td style={{ fontWeight: 600 }}>{stats.totalCustomers}</td></tr>
              <tr><td>Pending Inquiries</td><td style={{ fontWeight: 600, color: 'var(--warning)' }}>{stats.pendingInquiries}</td></tr>
              <tr><td>Conversion Rate</td><td style={{ fontWeight: 600 }}>{stats.totalInquiries ? Math.round(((stats.statusDistribution.find(s => s.status === 'CLOSED')?.count || 0) / stats.totalInquiries) * 100) : 0}%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
