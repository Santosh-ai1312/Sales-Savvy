import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// Customer Pages
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Orders from './pages/customer/Orders';
import Checkout from './pages/customer/Checkout';
import Profile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Layout
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Customer */}
        <Route path="/cart" element={<PrivateRoute role="CUSTOMER"><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute role="CUSTOMER"><Checkout /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute role="CUSTOMER"><Orders /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute role="CUSTOMER"><Profile /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute role="ADMIN"><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute role="ADMIN"><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute role="ADMIN"><AdminUsers /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
