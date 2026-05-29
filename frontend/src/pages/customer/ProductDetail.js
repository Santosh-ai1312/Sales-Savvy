import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addToCart } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { maxWidth: 900, margin: '40px auto', padding: '0 20px' },
  card: { display: 'flex', gap: 40, background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  img: { width: 340, height: 300, objectFit: 'cover', borderRadius: 12, background: '#f0f2f5' },
  info: { flex: 1 },
  category: { color: '#e94560', fontWeight: 700, textTransform: 'uppercase', fontSize: 13, marginBottom: 8 },
  name: { fontSize: 32, fontWeight: 900, color: '#1a1a2e', marginBottom: 12 },
  price: { fontSize: 36, fontWeight: 900, color: '#e94560', marginBottom: 16 },
  desc: { color: '#555', lineHeight: 1.7, marginBottom: 24 },
  meta: { display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
  tag: { background: '#f0f2f5', padding: '4px 14px', borderRadius: 20, fontSize: 13, color: '#333' },
  qty: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  qtyBtn: { width: 36, height: 36, borderRadius: '50%', border: '2px solid #e94560', background: '#fff', color: '#e94560', fontSize: 20, cursor: 'pointer', fontWeight: 700 },
  addBtn: { padding: '14px 40px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 10, fontSize: 17, fontWeight: 700, cursor: 'pointer' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { isCustomer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id).then(r => setProduct(r.data)).catch(() => toast.error('Product not found'));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isCustomer()) { toast.error('Please login as customer'); return navigate('/login'); }
    try {
      await addToCart(product.id, qty);
      toast.success(`Added ${qty} item(s) to cart!`);
    } catch { toast.error('Failed to add to cart'); }
  };

  if (!product) return <div style={{ textAlign: 'center', padding: 80, fontSize: 20 }}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <img src={product.imageUrl || `https://via.placeholder.com/340x300?text=${product.name}`}
          alt={product.name} style={s.img} />
        <div style={s.info}>
          <div style={s.category}>{product.category}</div>
          <div style={s.name}>{product.name}</div>
          <div style={s.price}>₹{product.price}</div>
          <div style={s.desc}>{product.description}</div>
          <div style={s.meta}>
            <span style={s.tag}>Stock: {product.stockQuantity}</span>
            <span style={s.tag}>Status: {product.status}</span>
            {product.tags && product.tags.split(',').map(t => (
              <span key={t} style={s.tag}>#{t.trim()}</span>
            ))}
          </div>
          <div style={s.qty}>
            <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span style={{ fontSize: 20, fontWeight: 700 }}>{qty}</span>
            <button style={s.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
          </div>
          <button style={s.addBtn} onClick={handleAddToCart}
            disabled={product.status !== 'AVAILABLE'}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
