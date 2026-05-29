import React, { useEffect, useState } from 'react';
import { getCart } from '../../services/api';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { maxWidth: 600, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 },
  card: { background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#e94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', marginBottom: 20 },
  label: { fontWeight: 600, color: '#333', display: 'block', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, marginBottom: 18, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 13, background: '#e94560', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  roleBadge: { display: 'inline-block', background: '#d4edda', color: '#155724', padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13, marginBottom: 20 },
};

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/user/profile').then(r => {
      setForm({ name: r.data.name || '', phone: r.data.phone || '' });
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/user/profile', form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.title}>👤 My Profile</div>
      <div style={s.card}>
        <div style={s.avatar}>{form.name?.[0]?.toUpperCase() || '?'}</div>
        <span style={s.roleBadge}>CUSTOMER</span>
        <p style={{ color: '#666', marginBottom: 20 }}>{user?.email}</p>
        <form onSubmit={handleUpdate}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <label style={s.label}>Phone</label>
          <input style={s.input} value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
