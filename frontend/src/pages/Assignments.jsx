
import { useState, useEffect } from "react";

function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    return (
        <div className="assignments-page">
            <header className="page-header">
                <div>
                    <h1>My Assignments</h1>
                    <p>Keep track of your coursework and deadlines.</p>
                </div>

                <button className="add-assignment-btn">
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
