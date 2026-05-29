import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', stockQuantity: '', category: '', tags: '', imageUrl: '', status: 'AVAILABLE' };

const s = {
  page: { maxWidth: 1100, margin: '40px auto', padding: '0 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e' },
  addBtn: { padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 15 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a1a2e', color: '#fff', padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700 },
  td: { padding: '13px 16px', borderBottom: '1px solid #f0f2f5', fontSize: 14 },
  editBtn: { padding: '6px 14px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontSize: 13 },
  delBtn: { padding: '6px 14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#fff', borderRadius: 14, padding: 36, width: 500, maxHeight: '90vh', overflowY: 'auto' },
  label: { fontWeight: 600, display: 'block', marginBottom: 6, color: '#333' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 15, marginBottom: 16, boxSizing: 'border-box' },
  saveBtn: { width: '100%', padding: 13, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { width: '100%', padding: 11, background: '#f0f2f5', color: '#333', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 10 },
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try { const res = await getProducts(); setProducts(res.data); }
    catch { toast.error('Failed to load products'); }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, stockQuantity: p.stockQuantity, category: p.category || '', tags: p.tags || '', imageUrl: p.imageUrl || '', status: p.status });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProduct(editing, form);
        toast.success('Product updated!');
      } else {
        await createProduct(form);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>📦 Product Management</div>
        <button style={s.addBtn} onClick={openCreate}>+ Add Product</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            {['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={s.td}>#{p.id}</td>
              <td style={s.td}>{p.name}</td>
              <td style={s.td}>{p.category}</td>
              <td style={s.td}>₹{p.price}</td>
              <td style={s.td}>{p.stockQuantity}</td>
              <td style={s.td}>
                <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: p.status === 'AVAILABLE' ? '#d4edda' : '#f8d7da', color: p.status === 'AVAILABLE' ? '#155724' : '#721c24' }}>
                  {p.status}
                </span>
              </td>
              <td style={s.td}>
                <button style={s.editBtn} onClick={() => openEdit(p)}>Edit</button>
                <button style={s.delBtn} onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={s.modal}>
          <div style={s.modalCard}>
            <h2 style={{ marginBottom: 24 }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSave}>
              {[
                { label: 'Name', key: 'name', type: 'text' },
                { label: 'Price (₹)', key: 'price', type: 'number' },
                { label: 'Stock Quantity', key: 'stockQuantity', type: 'number' },
                { label: 'Category', key: 'category', type: 'text' },
                { label: 'Tags (comma separated)', key: 'tags', type: 'text' },
                { label: 'Image URL', key: 'imageUrl', type: 'text' },
              ].map(field => (
                <React.Fragment key={field.key}>
                  <label style={s.label}>{field.label}</label>
                  <input style={s.input} type={field.type} value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
                </React.Fragment>
              ))}
              <label style={s.label}>Description</label>
              <textarea style={{ ...s.input, height: 80, resize: 'vertical' }}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <label style={s.label}>Status</label>
              <select style={s.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="AVAILABLE">Available</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
              <button style={s.saveBtn} type="submit">Save Product</button>
              <button style={s.cancelBtn} type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
