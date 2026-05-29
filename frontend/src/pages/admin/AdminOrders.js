import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: { bg: '#fff3cd', color: '#856404' },
  APPROVED: { bg: '#d4edda', color: '#155724' },
  SHIPPED: { bg: '#cce5ff', color: '#004085' },
  DELIVERED: { bg: '#d1ecf1', color: '#0c5460' },
  CANCELLED: { bg: '#f8d7da', color: '#721c24' },
};

const s = {
  page: { maxWidth: 1100, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700 },
  td: { padding: '13px 16px', borderBottom: '1px solid #f0f2f5', fontSize: 14, verticalAlign: 'top' },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  select: { padding: '7px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, cursor: 'pointer' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const res = await getAllOrders(); setOrders(res.data); }
    catch { toast.error('Failed to load orders'); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated!');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.title}>📋 Order Management</div>
      <table style={s.table}>
        <thead>
          <tr>
            {['Order ID', 'Customer', 'Items', 'Total', 'Shipping', 'Status', 'Date', 'Update'].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={s.td}>#{order.id}</td>
              <td style={s.td}>
                <div style={{ fontWeight: 600 }}>{order.user?.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{order.user?.email}</div>
              </td>
              <td style={s.td}>
                {order.items?.map(item => (
                  <div key={item.id} style={{ fontSize: 13 }}>
                    {item.product?.name} × {item.quantity}
                  </div>
                ))}
              </td>
              <td style={s.td} >
                <span style={{ fontWeight: 700, color: '#e94560' }}>₹{order.totalAmount}</span>
              </td>
              <td style={s.td}>{order.shippingOption}</td>
              <td style={s.td}>
                <span style={{ ...s.badge, ...(STATUS_COLORS[order.status] || {}) }}>
                  {order.status}
                </span>
              </td>
              <td style={s.td} >{new Date(order.createdAt).toLocaleDateString()}</td>
              <td style={s.td}>
                <select style={s.select} value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}>
                  {['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
