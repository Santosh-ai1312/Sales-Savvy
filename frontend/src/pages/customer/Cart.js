import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, clearCart } from '../../services/api';
import toast from 'react-hot-toast';

const s = {
  page: { maxWidth: 900, margin: '40px auto', padding: '0 20px' },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 },
  item: { display: 'flex', gap: 20, alignItems: 'center', background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  img: { width: 90, height: 90, objectFit: 'cover', borderRadius: 8, background: '#f0f2f5' },
  info: { flex: 1 },
  name: { fontWeight: 700, fontSize: 17, color: '#1a1a2e' },
  price: { color: '#e94560', fontWeight: 700, fontSize: 16, marginTop: 4 },
  qty: { display: 'flex', alignItems: 'center', gap: 10 },
  qBtn: { width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e94560', background: '#fff', color: '#e94560', cursor: 'pointer', fontWeight: 700 },
  removeBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: 20 },
  summary: { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: 24 },
  total: { fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 },
  checkoutBtn: { width: '100%', padding: 14, background: '#e94560', color: '#fff', border: 'none', borderRadius: 10, fontSize: 17, fontWeight: 700, cursor: 'pointer' },
  clearBtn: { width: '100%', padding: 12, background: '#f0f2f5', color: '#333', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 10 },
};

export default function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try { const res = await getCart(); setCart(res.data); }
    catch { toast.error('Failed to load cart'); }
  };

  const handleQty = async (productId, qty) => {
    try { const res = await updateCartItem(productId, qty); setCart(res.data); }
    catch { toast.error('Update failed'); }
  };

  const handleClear = async () => {
    try { const res = await clearCart(); setCart(res.data); toast.success('Cart cleared'); }
    catch { toast.error('Failed to clear'); }
  };

  if (!cart) return <div style={{ textAlign: 'center', padding: 80 }}>Loading cart...</div>;

  const items = cart.items || [];
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div style={s.page}>
      <div style={s.title}>🛒 Your Cart ({items.length} items)</div>
      {items.length === 0
        ? <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>Your cart is empty</div>
        : <>
          {items.map(item => (
            <div key={item.id} style={s.item}>
              <img src={item.product.imageUrl || `https://via.placeholder.com/90?text=${item.product.name}`}
                alt={item.product.name} style={s.img} />
              <div style={s.info}>
                <div style={s.name}>{item.product.name}</div>
                <div style={s.price}>₹{item.product.price} each</div>
              </div>
              <div style={s.qty}>
                <button style={s.qBtn} onClick={() => handleQty(item.product.id, item.quantity - 1)}>−</button>
                <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                <button style={s.qBtn} onClick={() => handleQty(item.product.id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, minWidth: 80, textAlign: 'right' }}>
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button style={s.removeBtn} onClick={() => handleQty(item.product.id, 0)}>✕</button>
            </div>
          ))}
          <div style={s.summary}>
            <div style={s.total}>Total: ₹{total.toFixed(2)}</div>
            <button style={s.checkoutBtn} onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <button style={s.clearBtn} onClick={handleClear}>Clear Cart</button>
          </div>
        </>
      }
    </div>
  );
}
