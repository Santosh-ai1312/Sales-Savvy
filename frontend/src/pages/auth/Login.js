import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  title: { fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 },
  sub: { color: '#666', marginBottom: 28, fontSize: 14 },
  label: { display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, marginBottom: 18, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 12, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  link: { display: 'block', textAlign: 'center', marginTop: 18, color: '#e94560', textDecoration: 'none' },
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>Welcome Back 👋</div>
        <div style={s.sub}>Login to your Sales Savvy account</div>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/register" style={s.link}>Don't have an account? Register</Link>
        <Link to="/admin/login" style={{ ...s.link, color: '#666' }}>Admin Login →</Link>
      </div>
    </div>
  );
}
