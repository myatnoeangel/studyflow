from flask import Flask, jsonify
from flask_cors import CORS

from database import get_connection

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to StudyFlow API!",
        "status": "running"
    })


@app.route("/api/assignments", methods=["GET"])
def get_assignments():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    SELECT
                        a.assignment_id,
                        a.title,
                        a.description,
                        s.subject_name,
                        a.due_date,
                        a.priority,
                        a.status
                    FROM assignments a
                    JOIN subjects s
                        ON a.subject_id = s.subject_id
                    ORDER BY a.due_date ASC;
                """)

                rows = cur.fetchall()

                assignments = []

                for row in rows:
                    assignments.append({
                        "id": row[0],
                        "title": row[1],
                        "description": row[2],
                        "subject": row[3],
                        "due_date": row[4].isoformat(),
                        "priority": row[5],
                        "status": row[6]
                    })

                return jsonify(assignments)

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to retrieve assignments"
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)