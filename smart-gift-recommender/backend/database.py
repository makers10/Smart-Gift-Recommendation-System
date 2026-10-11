import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "gift_data.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS search_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT, relationship TEXT, occasion TEXT,
        budget TEXT, gender TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
    try: c.execute("ALTER TABLE search_logs ADD COLUMN user_id TEXT")
    except: pass

    c.execute("""CREATE TABLE IF NOT EXISTS gift_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gift_name TEXT, relationship TEXT, occasion TEXT,
        vote INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    c.execute("""CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT, gift_name TEXT, relationship TEXT,
        occasion TEXT, budget TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
    try: c.execute("ALTER TABLE wishlist ADD COLUMN user_id TEXT")
    except: pass

    # ── CUSTOM GIFT MARKETPLACE ──────────────────────────────────
    c.execute("""CREATE TABLE IF NOT EXISTS custom_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_id TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        occasion TEXT,
        budget_min INTEGER DEFAULT 0,
        budget_max INTEGER DEFAULT 0,
        deadline TEXT,
        status TEXT DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    c.execute("""CREATE TABLE IF NOT EXISTS custom_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        seller_id TEXT NOT NULL,
        seller_name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        delivery_days INTEGER DEFAULT 7,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES custom_orders(id))""")

    c.execute("""CREATE TABLE IF NOT EXISTS custom_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        offer_id INTEGER,
        sender_id TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES custom_orders(id))""")

    conn.commit()
    conn.close()
