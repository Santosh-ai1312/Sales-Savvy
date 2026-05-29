import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: { bg: '#fff3cd', color: '#856404' },
  APPROVED: { bg: '#d4edda', color: '#155724' },
  SHIPPED: { bg: '#cce5ff', color: '#004085' },
  DELIVERED: { bg: '#d4edda', color: '#155724' },
  CANCELLED: { bg: '#f8d7da', color: '#721c24' },
};

const s = {
  page: { maxWidth: 900, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 },
  card: { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  orderId: { fontWeight: 700, fontSize: 16, color: '#1a1a2e' },
  badge: { padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  item: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f5' },
  total: { fontWeight: 800, fontSize: 18, color: '#e94560', textAlign: 'right', marginTop: 12 },
  meta: { color: '#888', fontSize: 13, marginTop: 8 },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

 const fetchOrders = async () => {
  try {
    const res = await getMyOrders();

    console.log("Orders API 👉", res.data);

    const ordersArray =
      Array.isArray(res.data)
        ? res.data
        : res.data.orders
        ? res.data.orders
        : res.data.data
        ? res.data.data
        : [];

    setOrders(ordersArray);
  } catch (err) {
    console.error(err);
    toast.error('Failed to load orders');
  }
};

  return (
    <div style={s.page}>
      <div style={s.title}>📋 My Orders</div>

      {!Array.isArray(orders) || orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#666' }}>
          No orders yet. Start shopping!
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={s.card}>
            <div style={s.header}>
              <span style={s.orderId}>Order #{order.id}</span>
              <span style={{ ...s.badge, ...STATUS_COLORS[order.status] }}>
                {order.status}
              </span>
            </div>

            {(order.items || []).map(item => (
              <div key={item.id} style={s.item}>
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span>
                  ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div style={s.total}>Total: ₹{order.totalAmount}</div>

            <div style={s.meta}>
              📍 {order.shippingAddress} &nbsp;|&nbsp;
              🚚 {order.shippingOption} &nbsp;|&nbsp;
              📅 {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}