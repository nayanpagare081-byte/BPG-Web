'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import {
  Package,
  MessageSquare,
  Users,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ totalProducts: number; totalInquiries: number; totalCustomers: number; pendingInquiries: number; statusDistribution?: unknown[]; categoryDistribution?: unknown[]; salesTrend?: { date: string, inquiries: number, value: number }[] } | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Array<{ id: string; name: string; email: string; [key: string]: unknown }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching data...");

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

        const [statsRes, inquiriesRes] = await Promise.all([
          fetch('/api/admin/stats', { signal: controller.signal }),
          fetch('/api/inquiries', { signal: controller.signal }),
        ]);

        clearTimeout(timeout);

        if (!statsRes.ok || !inquiriesRes.ok) {
          throw new Error('API failed');
        }

        const statsData = await statsRes.json();
        const inquiriesData = await inquiriesRes.json();

        console.log("STATS:", statsData);
        console.log("INQUIRIES:", inquiriesData);

        setStats(statsData);
        setRecentInquiries(inquiriesData.slice(0, 5));
      } catch (err) {
        console.error("Fetch error:", err);

        // fallback dummy data (so UI never breaks)
        setStats({
          totalProducts: 0,
          totalInquiries: 0,
          totalCustomers: 0,
          pendingInquiries: 0,
          statusDistribution: [],
          categoryDistribution: [],
          salesTrend: []
        });
        setRecentInquiries([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // EXTRA safety: force stop loading after 6 sec
    setTimeout(() => setLoading(false), 6000);

  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 32 }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-dim)' }}>Business overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <Card icon={<Package />} label="Products" value={stats?.totalProducts} />
        <Card icon={<MessageSquare />} label="Inquiries" value={stats?.totalInquiries} />
        <Card icon={<Users />} label="Customers" value={stats?.totalCustomers} />
        <Card icon={<AlertCircle />} label="Pending" value={stats?.pendingInquiries} />
      </div>

      {/* Sales Trend Chart */}
      <div style={{ marginTop: 40, padding: 24, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 12 }}>
        <h3 style={{ marginTop: 0, marginBottom: 24 }}>Sales & Inquiry Trend (Last 30 Days)</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={stats?.salesTrend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.substring(5)} />
              <YAxis yAxisId="left" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--primary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface-high)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="inquiries" stroke="var(--text)" name="Inquiries" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="var(--primary)" name="Value ($)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent */}
      <div style={{ marginTop: 40 }}>
        <h3>Recent Inquiries</h3>

        {recentInquiries.length === 0 ? (
          <p style={{ color: 'var(--text-dim)' }}>No recent inquiries available</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentInquiries.map((inq) => (
              <div key={inq.id} style={{
                padding: '16px 20px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0, marginBottom: 4 }}>{inq.name}</h4>
                  <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>{inq.email}</p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  color: 'var(--primary)',
                  borderRadius: 20,
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  {String(inq.status || 'NEW')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string | undefined }) {
  return (
    <div style={{
      padding: 24,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 12
    }}>
      <div>{icon}</div>
      <h2>{value ?? 0}</h2>
      <p>{label}</p>
    </div>
  );
}