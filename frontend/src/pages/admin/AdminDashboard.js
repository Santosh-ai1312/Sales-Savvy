import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getAllUsers, getProducts } from '../../services/api';

const s = {
  page: { maxWidth: 1100, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 32, fontWeight: 900, color: '#1a1a2e', marginBottom: 8 },
  sub: { color: '#666', marginBottom: 36 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 },
  statCard: { borderRadius: 14, padding: 28, color: '#fff', display: 'flex', flexDirection: 'column', gap: 8 },
  statNum: { fontSize: 42, fontWeight: 900 },
  statLabel: { fontSize: 15, opacity: 0.85 },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  quickCard: { background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textDecoration: 'none', color: '#1a1a2e', transition: 'transform 0.2s' },
  quickIcon: { fontSize: 40, marginBottom: 10 },
  quickLabel: { fontWeight: 700, fontSize: 16 },
};

const STATS_COLORS = ['#e94560', '#0f3460', '#533483', '#16213e'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, users: 0, products: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([getAllOrders(), getAllUsers(), getProducts()]).then(([o, u, p]) => {
      const revenue = o.data.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      setStats({ orders: o.data.length, users: u.data.length, products: p.data.length, revenue });
    });
  }, []);

  const statItems = [
    { label: 'Total Orders', value: stats.orders },
    { label: 'Registered Users', value: stats.users },
    { label: 'Products Listed', value: stats.products },
    { label: 'Revenue (₹)', value: `₹${stats.revenue.toFixed(0)}` },
  ];

  const quickLinks = [
    { label: 'Manage Products', icon: '📦', to: '/admin/products' },
    { label: 'Manage Orders', icon: '📋', to: '/admin/orders' },
    { label: 'Manage Users', icon: '👥', to: '/admin/users' },
  ];

  return (
    <div style={s.page}>
      <div style={s.title}>🛠 Admin Dashboard</div>
      <div style={s.sub}>Sales Savvy — Control Center</div>

      <div style={s.grid}>
        {statItems.map((item, i) => (
          <div key={i} style={{ ...s.statCard, background: STATS_COLORS[i] }}>
            <div style={s.statNum}>{item.value}</div>
            <div style={s.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: 20 }}>Quick Actions</h2>
      <div style={s.quickGrid}>
        {quickLinks.map((l, i) => (
          <Link key={i} to={l.to} style={s.quickCard}>
            <div style={s.quickIcon}>{l.icon}</div>
            <div style={s.quickLabel}>{l.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
