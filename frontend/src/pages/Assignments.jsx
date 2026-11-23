
import { useState, useEffect } from "react";

function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [subjects, setSubjects] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subject_id: "",
        description: "",
        due_date: "",
        priority: "medium",
        status: "pending"
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/assignments"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }

                const data = await response.json();
                setAssignments(data);

            } catch (err) {
                console.error(err);
                setError("Unable to load assignments.");

            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(search.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            assignment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/assignments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        subject_id: Number(formData.subject_id)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create assignment");
            }

            const newAssignment = await response.json();

            console.log("Assignment created:", newAssignment);

            // Refresh assignments
            const updatedResponse = await fetch(
                "http://127.0.0.1:5000/api/assignments"
            );

            const updatedData = await updatedResponse.json();
            setAssignments(updatedData);

            // Reset form
            setFormData({
                title: "",
                subject_id: "",
                description: "",
                due_date: "",
                priority: "medium",
                status: "pending"
            });

            setShowForm(false);

        } catch (err) {
            console.error(err);
            alert("Unable to create assignment.");
        }
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/subjects"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch subjects");
                }

                const data = await response.json();
                setSubjects(data);

            } catch (err) {
                console.error("Error fetching subjects:", err);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="assignments-page">
            <header className="page-header">
                <div>
                    <h1>My Assignments</h1>
                    <p>Keep track of your coursework and deadlines.</p>
                </div>

                <button
                    className="add-assignment-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Add Assignment
                </button>
            </header>

            <section className="assignment-controls">
                <input
                    type="text"
                    placeholder="Search assignments or subjects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </section>

            {showForm && (
                <section className="assignment-form-section">
                    <h2>Add New Assignment</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Assignment Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }
                            placeholder="e.g. Database Coursework"
                            required
                        />

                        <label>Subject</label>
                        <select
                            value={formData.subject_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subject_id: e.target.value
                                })
                            }
                            required
                        >
                            <option value="">Select a subject</option>

                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>

                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            placeholder="Add some details..."
                        />

                        <label>Due Date</label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    due_date: e.target.value
                                })
                            }
                            required
                        />

                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    priority: e.target.value
                                })
                            }
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value
                                })
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="form-actions">
                            <button type="submit">
                                Save Assignment
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="assignments-container">
                {loading ? (
                    <p>Loading assignments...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredAssignments.length === 0 ? (
                    <p>No assignments found.</p>
                ) : (
                    filteredAssignments.map(assignment => (
                        <article
                            className="assignment-card"
                            key={assignment.id}
                        >
                            <div className="assignment-card-main">
                                <h3>{assignment.title}</h3>
                                <p>{assignment.subject}</p>
                                <p>
                                    Due: {new Date(
                                        assignment.due_date
                                    ).toLocaleDateString("en-GB")}
                                </p>
                            </div>

                            <div className="assignment-card-meta">
                                <span className={`priority ${assignment.priority}`}>
                                    {assignment.priority}
                                </span>

                                <span className={`status ${assignment.status}`}>
                                    {assignment.status.replace("_", " ")}
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
}

export default Assignments;
