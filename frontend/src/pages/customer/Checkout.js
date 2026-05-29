import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCart,
  placeOrder,
  createPayment,
  verifyPayment,
} from '../../services/api';
import toast from 'react-hot-toast';

const s = {
  page: {
    maxWidth: 700,
    margin: '40px auto',
    padding: '0 20px',
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    color: '#1a1a2e',
    marginBottom: 28,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  label: {
    fontWeight: 600,
    color: '#333',
    display: 'block',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 15,
    marginBottom: 18,
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 15,
    marginBottom: 18,
  },
  summary: {
    background: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  total: {
    fontWeight: 800,
    fontSize: 20,
    borderTop: '1px solid #ddd',
    paddingTop: 12,
    marginTop: 8,
  },
  btn: {
    width: '100%',
    padding: 14,
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({
    shippingAddress: '',
    shippingOption: 'STANDARD',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      console.log('CART 👉', res.data);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
      toast.error('Failed to load cart');
    }
  };

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!form.shippingAddress.trim()) {
      toast.error('Enter shipping address');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order
      const orderRes = await placeOrder({
        shippingAddress: form.shippingAddress,
        shippingOption: form.shippingOption,
        paymentMethod: 'RAZORPAY',
      });

      console.log('ORDER RESPONSE FULL:', orderRes);
      console.log('ORDER RESPONSE DATA:', orderRes.data);

      // 2. Extract order from all possible response formats
      let order = null;

      // Case 1: Direct order object
      if (orderRes?.data?.id) {
        order = orderRes.data;
      }
      // Case 2: Wrapped in data
      else if (orderRes?.data?.data?.id) {
        order = orderRes.data.data;
      }
      // Case 3: Wrapped in order
      else if (orderRes?.data?.order?.id) {
        order = orderRes.data.order;
      }
      // Case 4: Backend returns array of order items
      else if (
        Array.isArray(orderRes.data) &&
        orderRes.data.length > 0 &&
        orderRes.data[0]?.order?.id
      ) {
        order = orderRes.data[0].order;
      }
      // Case 5: Backend returns only numeric ID
      else if (typeof orderRes.data === 'number') {
        order = { id: orderRes.data };
      }

      // 3. Validate order
      if (!order?.id) {
        console.error('Unable to find order ID in response:', orderRes.data);
        toast.error('Order creation failed');
        return;
      }

      console.log('ORDER ID:', order.id);

      // 4. Create Razorpay Payment
      const paymentRes = await createPayment(order.id);

      console.log('PAYMENT RESPONSE:', paymentRes.data);

      const {
        razorpayOrderId,
        amount,
        currency,
        keyId,
      } = paymentRes.data || {};

      if (!razorpayOrderId) {
        toast.error('Payment creation failed');
        return;
      }

      // 5. Check Razorpay SDK
      if (!window.Razorpay) {
        toast.error('Razorpay SDK not loaded');
        return;
      }

      // 6. Razorpay Options
      const options = {
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Sales Savvy',
        description: `Order #${order.id}`,

        prefill: {
          name: localStorage.getItem('name') || '',
          email: localStorage.getItem('email') || '',
        },

        theme: {
          color: '#e94560',
        },

        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            toast.success('Payment successful 🎉');
            navigate('/orders');
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed');
          }
        },

        modal: {
          ondismiss: () => {
            toast('Payment cancelled');
          },
        },
      };

      // 7. Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('CHECKOUT ERROR:', err);
      console.error('ERROR RESPONSE:', err.response?.data);

      toast.error(
        err.response?.data?.message ||
          (typeof err.response?.data === 'string'
            ? err.response.data
            : null) ||
          'Checkout failed'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        Loading cart...
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.title}>📦 Checkout</div>

      <form onSubmit={handleCheckout}>
        <div style={s.card}>
          <h3 style={{ marginBottom: 20 }}>Shipping Details</h3>

          <label style={s.label}>Shipping Address</label>
          <input
            style={s.input}
            placeholder="Enter full address"
            value={form.shippingAddress}
            onChange={(e) =>
              setForm({
                ...form,
                shippingAddress: e.target.value,
              })
            }
            required
          />

          <label style={s.label}>Shipping Option</label>
          <select
            style={s.select}
            value={form.shippingOption}
            onChange={(e) =>
              setForm({
                ...form,
                shippingOption: e.target.value,
              })
            }
          >
            <option value="STANDARD">
              Standard Delivery (3-5 days)
            </option>
            <option value="EXPRESS">
              Express Delivery (1-2 days)
            </option>
          </select>
        </div>

        <div style={s.summary}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>

          {cart.items.map((item) => (
            <div key={item.id} style={s.row}>
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ₹
                {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div style={{ ...s.row, ...s.total }}>
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Processing...' : '💳 Pay with Razorpay'}
        </button>
      </form>
    </div>
  );
}