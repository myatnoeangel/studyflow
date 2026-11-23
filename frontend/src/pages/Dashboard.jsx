
function Dashboard() {
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
                    <h2>12</h2>
                </div>

                <div className="stat-card">
                    <p>Completed</p>
                    <h2>05</h2>
                </div>

                <div className="stat-card">
                    <p>In Progress</p>
                    <h2>04</h2>
                </div>

                <div className="stat-card">
                    <p>Upcoming</p>
                    <h2>03</h2>
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