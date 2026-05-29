import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 32px', background: '#1a1a2e', color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: 22, fontWeight: 800, color: '#e94560', textDecoration: 'none' },
  links: { display: 'flex', gap: 20, alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: 15, transition: 'color 0.2s' },
  btn: {
    background: '#e94560', color: '#fff', border: 'none', borderRadius: 6,
    padding: '8px 18px', cursor: 'pointer', fontWeight: 600,
  },
};

export default function Navbar() {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🛍 Sales Savvy</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Products</Link>
        {isCustomer() && <Link to="/cart" style={styles.link}>🛒 Cart</Link>}
        {isCustomer() && <Link to="/orders" style={styles.link}>My Orders</Link>}
        {isCustomer() && <Link to="/profile" style={styles.link}>Profile</Link>}
        {isAdmin() && <Link to="/admin" style={styles.link}>Dashboard</Link>}
        {isAdmin() && <Link to="/admin/products" style={styles.link}>Products</Link>}
        {isAdmin() && <Link to="/admin/orders" style={styles.link}>Orders</Link>}
        {isAdmin() && <Link to="/admin/users" style={styles.link}>Users</Link>}
        {user
          ? <button style={styles.btn} onClick={handleLogout}>Logout</button>
          : <Link to="/login"><button style={styles.btn}>Login</button></Link>
        }
      </div>
    </nav>
  );
}
