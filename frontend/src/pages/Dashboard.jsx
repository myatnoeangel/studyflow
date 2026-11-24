
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

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

    // Get today's date without timezone conversion
    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    // Assignment statistics
    const totalAssignments = assignments.length;

    const completedAssignments = assignments.filter(
        a => a.status === "completed"
    ).length;

    const inProgressAssignments = assignments.filter(
        a => a.status === "in_progress"
    ).length;

    const pendingAssignments = assignments.filter(
        a => a.status === "pending"
    ).length;

    const completionRate = totalAssignments > 0
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0;

    // Deadline statistics
    const activeAssignments = assignments.filter(
        a => a.status !== "completed"
    );

    const overdueAssignments = activeAssignments.filter(
        a => a.due_date && a.due_date.slice(0, 10) < todayString
    ).length;

    const dueTodayAssignments = activeAssignments.filter(
        a => a.due_date && a.due_date.slice(0, 10) === todayString
    ).length;

    const upcomingAssignments = activeAssignments.filter(
        a => a.due_date && a.due_date.slice(0, 10) > todayString
    ).length;

    // Sort upcoming and overdue assignments by due date
    const upcomingList = activeAssignments
        .filter(
            a => a.due_date && a.due_date.slice(0, 10) >= todayString
        )
        .sort((a, b) =>
            a.due_date.localeCompare(b.due_date)
        )
        .slice(0, 5);

    // Dynamic greeting
    const hour = today.getHours();

    const greeting = hour < 12
        ? "Good morning"
        : hour < 18
            ? "Good afternoon"
            : "Good evening";

    const formattedDate = today.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const formatDueDate = (date) => {
        return new Date(date.slice(0, 10) + "T12:00:00")
            .toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
    };

    return (
        <div className="dashboard">

            {/* Welcome Header */}
            <header className="dashboard-header">
                <div>
                    <h1>{greeting}! 👋</h1>
                    <p>Let's make today productive.</p>
                </div>

                <div className="dashboard-date">
                    {formattedDate}
                </div>
            </header>

            {loading ? (
                <p className="dashboard-empty">
                    Loading your dashboard...
                </p>
            ) : error ? (
                <p className="dashboard-empty">{error}</p>
            ) : (
                <>
                    {/* Statistics */}
                    <section className="stats-grid">

                        <div className="stat-card total">
                            <p>Total Assignments</p>
                            <h2>{totalAssignments}</h2>
                        </div>

                        <div className="stat-card completed">
                            <p>Completed</p>
                            <h2>{completedAssignments}</h2>
                        </div>

                        <div className="stat-card progress">
                            <p>In Progress</p>
                            <h2>{inProgressAssignments}</h2>
                        </div>

                        <div className="stat-card pending">
                            <p>Pending</p>
                            <h2>{pendingAssignments}</h2>
                        </div>

                    </section>

                    {/* Main Dashboard Content */}
                    <div className="dashboard-content-grid">

                        {/* Left Column */}
                        <section className="dashboard-section">
                            <h2>Upcoming Assignments</h2>

                            <p className="section-description">
                                Your next deadlines at a glance.
                            </p>

                            {upcomingList.length === 0 ? (
                                <p className="dashboard-empty">
                                    No upcoming deadlines. You're all caught up! 🎉
                                </p>
                            ) : (
                                <div className="assignment-list">
                                    {upcomingList.map(assignment => (
                                        <article
                                            className="assignment-item"
                                            key={assignment.id}
                                        >
                                            <div>
                                                <h3>{assignment.title}</h3>

                                                <p>{assignment.subject}</p>

                                                <p>
                                                    Due: {formatDueDate(assignment.due_date)}
                                                </p>
                                            </div>

                                            <div className="assignment-meta">
                                                <span className={`priority ${assignment.priority}`}>
                                                    {assignment.priority}
                                                </span>

                                                <span className={`status ${assignment.status}`}>
                                                    {assignment.status.replace("_", " ")}
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            <Link
                                to="/assignments"
                                className="quick-action-btn"
                            >
                                View All Assignments →
                            </Link>
                        </section>

                        {/* Right Column */}
                        <div>
                            <section className="dashboard-section">
                                <h2>Study Progress</h2>

                                <p className="section-description">
                                    Your overall assignment completion.
                                </p>

                                <div className="progress-percentage">
                                    {completionRate}%
                                </div>

                                <div
                                    className="progress-track"
                                    role="progressbar"
                                    aria-valuenow={completionRate}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-label="Assignment completion rate"
                                >
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${completionRate}%`
                                        }}
                                    />
                                </div>

                                <p className="progress-caption">
                                    {completedAssignments} of {totalAssignments} assignments completed
                                </p>
                            </section>

                            <section
                                className="dashboard-section"
                                style={{ marginTop: "22px" }}
                            >
                                <h2>Deadline Overview</h2>

                                <p className="section-description">
                                    Keep an eye on your workload.
                                </p>

                                <div className="deadline-overview">

                                    <div className="deadline-item overdue">
                                        <span>Overdue</span>
                                        <strong>{overdueAssignments}</strong>
                                    </div>

                                    <div className="deadline-item today">
                                        <span>Due Today</span>
                                        <strong>{dueTodayAssignments}</strong>
                                    </div>

                                    <div className="deadline-item upcoming">
                                        <span>Upcoming</span>
                                        <strong>{upcomingAssignments}</strong>
                                    </div>

                                </div>

                                <Link
                                    to="/assignments"
                                    className="quick-action-btn"
                                >
                                    + Manage Assignments
                                </Link>
                            </section>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;