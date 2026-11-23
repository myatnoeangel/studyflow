
import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>StudyFlow</h2>
            </div>

            <nav className="sidebar-nav">
                <p className="nav-heading">MENU</p>

                <NavLink to="/" className="nav-link">
                    Dashboard
                </NavLink>

                <NavLink to="/assignments" className="nav-link">
                    Assignments
                </NavLink>

                <NavLink to="/calendar" className="nav-link">
                    Calendar
                </NavLink>

                <NavLink to="/study-tracker" className="nav-link">
                    Study Tracker
                </NavLink>

                <p className="nav-heading">WORKSPACE</p>

                <NavLink to="/subjects" className="nav-link">
                    My Subjects
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
