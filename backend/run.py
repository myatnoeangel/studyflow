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
                        a.subject_id,
                        a.title,
                        a.description,
                        s.subject_name,
                        s.colour,
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
                        "subject_id": row[1],
                        "title": row[2],
                        "description": row[3],
                        "subject": row[4],
                        "colour": row[5],
                        "due_date": row[6].isoformat(),
                        "priority": row[7],
                        "status": row[8]
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
                        s.subject_id,
                        s.subject_name,
                        s.colour,
                        COUNT(a.assignment_id) AS assignment_count
                    FROM subjects s
                    LEFT JOIN assignments a
                        ON s.subject_id = a.subject_id
                    WHERE s.user_id = %s
                    GROUP BY s.subject_id
                    ORDER BY s.subject_name ASC;
                """, (1,))

                rows = cur.fetchall()

                subjects = [
                    {
                        "id": row[0],
                        "name": row[1],
                        "colour": row[2],
                        "assignment_count": row[3]
                    }
                    for row in rows
                ]

                return jsonify(subjects)

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to retrieve subjects"
        }), 500


@app.route("/api/subjects", methods=["POST"])
def create_subject():
    data = request.get_json()

    if not data or not data.get("name", "").strip():
        return jsonify({"error": "Subject name is required"}), 400

    name = data["name"].strip()
    colour = data.get("colour", "#B69ACF")

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO subjects (user_id, subject_name, colour)
                    VALUES (%s, %s, %s)
                    RETURNING subject_id;
                """, (1, name, colour))

                new_id = cur.fetchone()[0]

                return jsonify({
                    "message": "Subject created successfully",
                    "id": new_id
                }), 201

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to create subject"
        }), 500


@app.route("/api/subjects/<int:subject_id>", methods=["PUT"])
def update_subject(subject_id):
    data = request.get_json()

    if not data or not data.get("name", "").strip():
        return jsonify({"error": "Subject name is required"}), 400

    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE subjects
                    SET subject_name = %s,
                        colour = %s
                    WHERE subject_id = %s
                      AND user_id = %s
                    RETURNING subject_id;
                """, (
                    data["name"].strip(),
                    data.get("colour", "#B69ACF"),
                    subject_id,
                    1
                ))

                updated = cur.fetchone()

                if updated is None:
                    return jsonify({"error": "Subject not found"}), 404

                return jsonify({
                    "message": "Subject updated successfully",
                    "id": updated[0]
                })

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to update subject"
        }), 500


@app.route("/api/subjects/<int:subject_id>", methods=["DELETE"])
def delete_subject(subject_id):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT subject_name
                    FROM subjects
                    WHERE subject_id = %s
                      AND user_id = %s;
                """, (subject_id, 1))

                subject = cur.fetchone()

                if subject is None:
                    return jsonify({"error": "Subject not found"}), 404

                cur.execute("""
                    SELECT COUNT(*)
                    FROM assignments
                    WHERE subject_id = %s;
                """, (subject_id,))

                assignment_count = cur.fetchone()[0]

                if assignment_count > 0:
                    return jsonify({
                        "error": "This subject has assignments. Move or delete them before deleting the subject."
                    }), 409

                cur.execute("""
                    DELETE FROM subjects
                    WHERE subject_id = %s
                      AND user_id = %s;
                """, (subject_id, 1))

                return jsonify({
                    "message": "Subject deleted successfully"
                })

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "error": "Unable to delete subject"
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
                        subject_id = %s,
                        title = %s,
                        description = %s,
                        due_date = %s,
                        priority = %s,
                        status = %s
                    WHERE assignment_id = %s
                    RETURNING assignment_id;
                """, (
                    (
                        data["subject_id"],
                        data["title"],
                        data.get("description"),
                        data["due_date"],
                        data["priority"],
                        data["status"],
                        assignment_id
                    )
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