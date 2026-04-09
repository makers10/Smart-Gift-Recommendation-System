import sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "gift_data.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    # search logs — every recommendation request
    c.execute("""
        CREATE TABLE IF NOT EXISTS search_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            relationship TEXT,
            occasion TEXT,
            budget TEXT,
            gender TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # gift votes — thumbs up/down per gift item
    c.execute("""
        CREATE TABLE IF NOT EXISTS gift_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gift_name TEXT,
            relationship TEXT,
            occasion TEXT,
            vote INTEGER,  -- 1 = thumbs up, -1 = thumbs down
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # wishlist
    c.execute("""
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gift_name TEXT,
            relationship TEXT,
            occasion TEXT,
            budget TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
