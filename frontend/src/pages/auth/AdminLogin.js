import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' },
  card: { background: '#16213e', borderRadius: 12, padding: 40, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', border: '1px solid #e94560' },
  title: { fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6 },
  sub: { color: '#aaa', marginBottom: 28, fontSize: 14 },
  label: { display: 'block', fontWeight: 600, marginBottom: 6, color: '#ccc' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #333', background: '#0f3460', color: '#fff', fontSize: 15, marginBottom: 18, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 12, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
};

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      login(res.data);
      toast.success('Admin logged in!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>🔐 Admin Portal</div>
        <div style={s.sub}>Sales Savvy Admin Access</div>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Admin Email</label>
          <input style={s.input} type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
