import { useState, useEffect } from "react";

function Dashboard() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                console.log("Assignments received:", data);

                setAssignments(data);

            } catch (err) {
                console.error("Error fetching assignments:", err);
                setError("Unable to load assignments.");

            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const totalAssignments = assignments.length;

    const completedAssignments = assignments.filter(
        assignment => assignment.status === "completed"
    ).length;

    const inProgressAssignments = assignments.filter(
        assignment => assignment.status === "in_progress"
    ).length;

    const upcomingAssignments = assignments.filter(
        assignment =>
            assignment.status === "pending" &&
            new Date(assignment.due_date) >= new Date()
    ).length;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Good evening! 👋</h1>
                    <p>Let's make today productive.</p>
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-card">
                    <p>Total Assignments</p>
                    <h2>{totalAssignments}</h2>
                </div>

                <div className="stat-card">
                    <p>Completed</p>
                    <h2>{completedAssignments}</h2>
                </div>

                <div className="stat-card">
                    <p>In Progress</p>
                    <h2>{inProgressAssignments}</h2>
                </div>

                <div className="stat-card">
                    <p>Upcoming</p>
                    <h2>{upcomingAssignments}</h2>
                </div>
            </section>

            <section className="dashboard-section">
                <h2>Upcoming Assignments</h2>
                <p>Your upcoming deadlines will appear here.</p>
            </section>
        </div>
    );
}

export default Dashboard;