from database import get_connection

try:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT version();")
            version = cur.fetchone()

            print("Successfully connected to StudyFlow!")
            print(version[0])

except Exception as e:
    print("Database connection failed:")
    print(e)