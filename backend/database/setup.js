const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/main.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Database connected!");
    }
});

db.serialize(() => {
    // Tabel Pengguna
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)");
    db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ['admin', 'password']);

    // Tabel Produk
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER)");
    const products = [
        { name: 'Kaos Polos Hitam', price: 120000, stock: 100 },
        { name: 'Kaos Polos Putih', price: 120000, stock: 100 },
        { name: 'Kemeja Flanel Monokrom', price: 280000, stock: 40 },
        { name: 'Jaket Hoodie Hitam', price: 350000, stock: 30 }
    ];
    const stmt = db.prepare("INSERT OR IGNORE INTO products (name, price, stock) VALUES (?, ?, ?)");
    products.forEach(p => stmt.run(p.name, p.price, p.stock));
    stmt.finalize();

    // Tabel Pesanan
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        product_name TEXT,
        quantity INTEGER,
        total_price INTEGER,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`);
});

module.exports = db;
