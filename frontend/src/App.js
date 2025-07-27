import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

// --- Komponen-komponen Halaman ---

const LoginPage = ({ onLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    onLogin(username, password);
  };

  return (
    <div className="container login-container">
      <h2>Selamat Datang di CilacapStore</h2>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Username (coba: admin)" required />
        <input type="password" name="password" placeholder="Password (coba: password)" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const ProductPage = ({ products, onOrder }) => (
  <div>
    <h2>Daftar Produk</h2>
    <table>
      <thead>
        <tr>
          <th>Nama Produk</th>
          <th>Harga</th>
          <th>Stok</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>Rp {product.price.toLocaleString('id-ID')}</td>
            <td>{product.stock}</td>
            <td>
              <button onClick={() => onOrder(product)} disabled={product.stock === 0}>
                Pesan
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrderForm = ({ product, onSubmit, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = e.target.quantity.value;
    onSubmit(product.id, quantity);
  };

  return (
    <div className="form-pesan">
      <h2>Buat Pesanan</h2>
      <p><strong>Produk:</strong> {product.name}</p>
      <p><strong>Stok Tersisa:</strong> {product.stock}</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="number" 
          name="quantity" 
          placeholder="Jumlah" 
          min="1" 
          max={product.stock} 
          required 
        />
        <div className="actions">
          <button type="submit">Konfirmasi Pesanan</button>
          <button type="button" className="secondary" onClick={onCancel}>Batal</button>
        </div>
      </form>
    </div>
  );
};

const HistoryPage = ({ history }) => (
  <div>
    <h2>Riwayat Pesanan</h2>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Nama Produk</th>
          <th>Jumlah</th>
          <th>Total Harga</th>
        </tr>
      </thead>
      <tbody>
        {history.map(order => (
          <tr key={order.id}>
            <td>{new Date(order.order_date).toLocaleString('id-ID')}</td>
            <td>{order.product_name}</td>
            <td>{order.quantity}</td>
            <td>Rp {order.total_price.toLocaleString('id-ID')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


// --- Komponen Utama Aplikasi ---

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('products'); // products, order_form, history
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const productRes = await axios.get(`${API_URL}/products`);
      setProducts(productRes.data);
      const historyRes = await axios.get(`${API_URL}/orders`);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Tidak dapat terhubung ke server.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setUser(res.data.user);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('products');
  };

  const handleCreateOrder = async (productId, quantity) => {
    try {
      await axios.post(`${API_URL}/orders`, { product_id: productId, quantity });
      alert('Pesanan berhasil dibuat!');
      fetchData(); // Refresh data
      setPage('products');
    } catch (err) {
      alert('Gagal membuat pesanan: ' + (err.response?.data?.message || 'Error tidak diketahui'));
    }
  };

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </>
    );
  }

  const renderPage = () => {
    if (page === 'order_form') {
      return <OrderForm product={selectedProduct} onSubmit={handleCreateOrder} onCancel={() => setPage('products')} />;
    }
    if (page === 'history') {
      return <HistoryPage history={history} />;
    }
    return <ProductPage products={products} onOrder={(product) => { setSelectedProduct(product); setPage('order_form'); }} />;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>CilacapStore</h1>
        <div>
          <span>Halo, {user.username}!</span> &nbsp;
          <button className="secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="page-controls">
        <button onClick={() => setPage('products')} disabled={page === 'products' || page === 'order_form'}>Daftar Produk</button>
        <button onClick={() => setPage('history')} disabled={page === 'history'}>Riwayat Pesanan</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderPage()}
    </div>
  );
}

export default App;
