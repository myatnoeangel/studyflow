from flask import Flask, jsonify, request
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

@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    SELECT
                        subject_id,
                        subject_name,
                        colour
                    FROM subjects
                    ORDER BY subject_name ASC;
                """)

                rows = cur.fetchall()

                subjects = []

                for row in rows:
                    subjects.append({
                        "id": row[0],
                        "name": row[1],
                        "colour": row[2]
                    })

                return jsonify(subjects)

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to retrieve subjects"
        }), 500

@app.route("/api/assignments", methods=["POST"])
def create_assignment():
    data = request.get_json()

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    INSERT INTO assignments
                    (subject_id, title, description, due_date, priority, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING assignment_id;
                """, (
                    data["subject_id"],
                    data["title"],
                    data.get("description"),
                    data["due_date"],
                    data["priority"],
                    data.get("status", "pending")
                ))

                new_id = cur.fetchone()[0]

                return jsonify({
                    "message": "Assignment created successfully",
                    "id": new_id
                }), 201

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to create assignment"
        }), 500

@app.route("/api/assignments/<int:assignment_id>", methods=["PUT"])
def update_assignment(assignment_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    UPDATE assignments
                    SET
                        title = %s,
                        description = %s,
                        due_date = %s,
                        priority = %s,
                        status = %s
                    WHERE assignment_id = %s
                    RETURNING assignment_id;
                """, (
                    data["title"],
                    data.get("description"),
                    data["due_date"],
                    data["priority"],
                    data["status"],
                    assignment_id
                ))

                updated = cur.fetchone()

                if updated is None:
                    return jsonify({
                        "error": "Assignment not found"
                    }), 404

                return jsonify({
                    "message": "Assignment updated successfully",
                    "id": updated[0]
                })

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to update assignment"
        }), 500


@app.route("/api/assignments/<int:assignment_id>", methods=["DELETE"])
def delete_assignment(assignment_id):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

                cur.execute("""
                    DELETE FROM assignments
                    WHERE assignment_id = %s
                    RETURNING assignment_id;
                """, (assignment_id,))

                deleted = cur.fetchone()

                if deleted is None:
                    return jsonify({
                        "error": "Assignment not found"
                    }), 404

                return jsonify({
                    "message": "Assignment deleted successfully",
                    "id": deleted[0]
                })

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to delete assignment"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)