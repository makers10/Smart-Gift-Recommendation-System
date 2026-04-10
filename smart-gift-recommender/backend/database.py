import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "gift_data.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS search_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            relationship TEXT,
            occasion TEXT,
            budget TEXT,
            gender TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # migrate: add user_id column if it doesn't exist yet
    try:
        c.execute("ALTER TABLE search_logs ADD COLUMN user_id TEXT")
    except Exception:
        pass

    c.execute("""
        CREATE TABLE IF NOT EXISTS gift_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gift_name TEXT,
            relationship TEXT,
            occasion TEXT,
            vote INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            gift_name TEXT,
            relationship TEXT,
            occasion TEXT,
            budget TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # migrate: add user_id to wishlist if missing
    try:
        c.execute("ALTER TABLE wishlist ADD COLUMN user_id TEXT")
    except Exception:
        pass

    conn.commit()
    conn.close()
