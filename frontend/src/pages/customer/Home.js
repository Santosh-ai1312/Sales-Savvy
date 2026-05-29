import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts, addToCart } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 20px' },
  hero: { textAlign: 'center', marginBottom: 40 },
  heroTitle: { fontSize: 40, fontWeight: 900, color: '#1a1a2e' },
  heroSub: { color: '#666', fontSize: 18, marginTop: 8 },
  searchBar: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 },
  searchInput: { padding: '12px 20px', borderRadius: 30, border: '2px solid #e94560', width: 340, fontSize: 15 },
  searchBtn: { padding: '12px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 30, cursor: 'pointer', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s' },
  img: { width: '100%', height: 200, objectFit: 'cover', background: '#f0f2f5' },
  cardBody: { padding: 18 },
  name: { fontWeight: 700, fontSize: 17, color: '#1a1a2e', marginBottom: 6 },
  category: { fontSize: 12, color: '#e94560', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 12 },
  actions: { display: 'flex', gap: 8 },
  btn: { flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  cartBtn: { background: '#e94560', color: '#fff' },
  detailBtn: { background: '#f0f2f5', color: '#1a1a2e' },
  badge: { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { isCustomer } = useAuth();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchProducts();
    try {
      const res = await searchProducts({ name: query });
      setProducts(res.data);
    } catch { toast.error('Search failed'); }
  };

  const handleAddToCart = async (productId) => {
    if (!isCustomer()) { toast.error('Please login as customer'); return; }
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroTitle}>🛍 Sales Savvy Store</div>
        <div style={s.heroSub}>Discover amazing products at great prices</div>
        <form style={s.searchBar} onSubmit={handleSearch}>
          <input style={s.searchInput} placeholder="Search products..."
            value={query} onChange={e => setQuery(e.target.value)} />
          <button style={s.searchBtn} type="submit">Search</button>
        </form>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60, fontSize: 20 }}>Loading products...</div> : (
        <div style={s.grid}>
          {products.map(p => (
            <div key={p.id} style={s.card}>
              <img src={p.imageUrl || `https://via.placeholder.com/300x200?text=${p.name}`}
                alt={p.name} style={s.img} />
              <div style={s.cardBody}>
                <div style={s.category}>{p.category || 'General'}</div>
                <div style={s.name}>{p.name}</div>
                <div style={s.price}>₹{p.price}</div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    ...s.badge,
                    background: p.status === 'AVAILABLE' ? '#d4edda' : '#f8d7da',
                    color: p.status === 'AVAILABLE' ? '#155724' : '#721c24',
                  }}>{p.status}</span>
                </div>
                <div style={s.actions}>
                  <button style={{ ...s.btn, ...s.cartBtn }}
                    onClick={() => handleAddToCart(p.id)}
                    disabled={p.status !== 'AVAILABLE'}>
                    🛒 Add to Cart
                  </button>
                  <Link to={`/products/${p.id}`} style={{ flex: 1 }}>
                    <button style={{ ...s.btn, ...s.detailBtn, width: '100%' }}>Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
