const db = require('../database/setup.js');

exports.getProducts = (req, res) => {
    db.all("SELECT * FROM products ORDER BY name", [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil produk' });
        res.json(rows);
    });
};

exports.createOrder = (req, res) => {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Data pesanan tidak valid' });
    }
    db.get("SELECT * FROM products WHERE id = ?", [product_id], (err, product) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stok produk tidak mencukupi' });
        }
        
        const totalPrice = product.price * quantity;
        const newStock = product.stock - quantity;

        db.run("UPDATE products SET stock = ? WHERE id = ?", [newStock, product_id], (err) => {
            if (err) return res.status(500).json({ message: 'Gagal update stok' });
            
            const insertOrderSql = "INSERT INTO orders (product_id, product_name, quantity, total_price) VALUES (?, ?, ?, ?)";
            db.run(insertOrderSql, [product.id, product.name, quantity, totalPrice], function(err) {
                if (err) return res.status(500).json({ message: 'Gagal membuat pesanan' });
                res.status(201).json({ message: 'Pesanan berhasil dibuat!', orderId: this.lastID });
            });
        });
    });
};

exports.getOrderHistory = (req, res) => {
    const sql = "SELECT id, product_name, quantity, total_price, order_date FROM orders ORDER BY order_date DESC";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil riwayat pesanan' });
        res.json(rows);
    });
};
