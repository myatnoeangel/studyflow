
import psycopg
from dotenv import load_dotenv
import os

load_dotenv()

conn = psycopg.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

with conn.cursor() as cur:

    cur.execute("""
        SELECT current_database(), current_user,
               inet_server_port(), current_schema();
    """)
    print("DATABASE CONNECTION:")
    print(cur.fetchone())

    cur.execute("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        ORDER BY table_schema, table_name;
    """)

    print("\nTABLES FOUND:")
    for table in cur.fetchall():
        print(table)

with conn.cursor() as cur:
    for table in ["users", "subjects", "assignments", "study_sessions"]:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        count = cur.fetchone()[0]
        print(f"{table}: {count} records")

with conn.cursor() as cur:
    for table in ["users", "subjects", "assignments", "study_sessions"]:
        print(f"\n--- {table.upper()} ---")

        cur.execute(f"SELECT * FROM {table} LIMIT 5")

        columns = [desc[0] for desc in cur.description]
        print("Columns:", columns)

        for row in cur.fetchall():
            print(row)

conn.close()