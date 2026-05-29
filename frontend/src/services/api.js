import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/user/login', data);
export const loginAdmin = (data) => API.post('/auth/admin/login', data);

// ─── Products ──────────────────────────────────────────────────
export const getProducts = () => API.get('/products/public');
export const getProduct = (id) => API.get(`/products/public/${id}`);
export const searchProducts = (params) => API.get('/products/public/search', { params });
export const getProductsByCategory = (cat) => API.get(`/products/public/category/${cat}`);

// Admin product management
export const createProduct = (data) => API.post('/admin/products', data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);

// ─── Cart ──────────────────────────────────────────────────────
export const getCart = () => API.get("/user/cart");
export const addToCart = (productId, quantity) => API.post('/user/cart/add', { productId, quantity });
export const updateCartItem = (productId, quantity) => API.put('/user/cart/update', { productId, quantity });
export const clearCart = () => API.delete('/user/cart/clear');

// ─── Orders ────────────────────────────────────────────────────
export const placeOrder = (data) => API.post('/user/orders', data);
export const getMyOrders = () => API.get('/user/orders');
export const getOrderDetail = (id) => API.get(`/user/orders/${id}`);
export const getAllOrders = () => API.get('/admin/orders');
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });

// ─── Payments ──────────────────────────────────────────────────
export const createPayment = (orderId) => API.post(`/user/payments/create/${orderId}`);
export const verifyPayment = (data) => API.post('/user/payments/verify', data);

// ─── Users (Admin) ─────────────────────────────────────────────
export const getAllUsers = () => API.get('/admin/users');
export const updateUserRole = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const updateUserStatus = (id, status) => API.put(`/admin/users/${id}/status`, { status });

export default API;
