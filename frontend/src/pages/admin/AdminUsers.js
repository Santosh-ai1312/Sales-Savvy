import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, updateUserStatus } from '../../services/api';
import toast from 'react-hot-toast';

const s = {
  page: { maxWidth: 1100, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700 },
  td: { padding: '13px 16px', borderBottom: '1px solid #f0f2f5', fontSize: 14 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  select: { padding: '7px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, cursor: 'pointer' },
};

const ROLE_COLORS = { ADMIN: { bg: '#cce5ff', color: '#004085' }, CUSTOMER: { bg: '#d4edda', color: '#155724' } };
const STATUS_COLORS = { ACTIVE: { bg: '#d4edda', color: '#155724' }, INACTIVE: { bg: '#fff3cd', color: '#856404' }, BANNED: { bg: '#f8d7da', color: '#721c24' } };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const res = await getAllUsers(); setUsers(res.data); }
    catch { toast.error('Failed to load users'); }
  };

  const handleRoleChange = async (id, role) => {
    try { await updateUserRole(id, role); toast.success('Role updated'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateUserStatus(id, status); toast.success('Status updated'); fetchUsers(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.title}>👥 User Management</div>
      <table style={s.table}>
        <thead>
          <tr>
            {['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Update Role', 'Update Status'].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={s.td}>#{user.id}</td>
              <td style={s.td}><strong>{user.name}</strong></td>
              <td style={s.td}>{user.email}</td>
              <td style={s.td}>{user.phone || '—'}</td>
              <td style={s.td}>
                <span style={{ ...s.badge, ...(ROLE_COLORS[user.role] || {}) }}>{user.role}</span>
              </td>
              <td style={s.td}>
                <span style={{ ...s.badge, ...(STATUS_COLORS[user.status] || {}) }}>{user.status}</span>
              </td>
              <td style={s.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td style={s.td}>
                <select style={s.select} value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}>
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td style={s.td}>
                <select style={s.select} value={user.status}
                  onChange={e => handleStatusChange(user.id, e.target.value)}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
