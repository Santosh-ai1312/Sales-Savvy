import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  title: { fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 },
  sub: { color: '#666', marginBottom: 28, fontSize: 14 },
  label: { display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, marginBottom: 18, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 12, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  link: { display: 'block', textAlign: 'center', marginTop: 18, color: '#e94560', textDecoration: 'none' },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.title}>Create Account 🚀</div>
        <div style={s.sub}>Join Sales Savvy today</div>
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Phone</label>
          <input style={s.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <Link to="/login" style={s.link}>Already have an account? Login</Link>
      </div>
    </div>
  );
}
