
import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [subjects, setSubjects] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [saving, setSaving] = useState(false);

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
                const response = await fetch("http://127.0.0.1:5000/api/assignments");

                if (!response.ok) {
                    throw new Error("Unable to load assignments");
                }

                const data = await response.json();
                setAssignments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

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

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getAssignmentsForDay = (day) => {
        const dateString = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

        return assignments.filter((assignment) => {
            return assignment.due_date.slice(0, 10) === dateString;
        });
    };

    const today = new Date();
    const isToday = (day) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const calendarDays = [];

    // Empty cells before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);

        setFormData({
            title: assignment.title,
            subject_id: String(assignment.subject_id),
            description: assignment.description || "",
            due_date: assignment.due_date.slice(0, 10),
            priority: assignment.priority,
            status: assignment.status
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/assignments/${selectedAssignment.id}`,
                {
                    method: "PUT",
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
                throw new Error("Failed to update assignment");
            }

            const updatedResponse = await fetch(
                "http://127.0.0.1:5000/api/assignments"
            );

            if (!updatedResponse.ok) {
                throw new Error("Failed to refresh assignments");
            }

            const updatedData = await updatedResponse.json();
            setAssignments(updatedData);
            setSelectedAssignment(null);

        } catch (err) {
            console.error(err);
            alert("Unable to update assignment.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div>
                    <h1>Calendar</h1>
                    <p>Keep track of your upcoming deadlines.</p>
                </div>

                <button className="today-button" onClick={goToToday}>
                    Today
                </button>
            </div>

            <div className="calendar-card">
                <div className="calendar-navigation">
                    <button onClick={previousMonth} aria-label="Previous month">
                        ‹
                    </button>

                    <h2>
                        {currentDate.toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>

                    <button onClick={nextMonth} aria-label="Next month">
                        ›
                    </button>
                </div>

                {selectedAssignment && (
                    <div
                        className="calendar-modal-overlay"
                        onClick={() => setSelectedAssignment(null)}
                    >
                        <section
                            className="calendar-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="calendar-modal-header">
                                <h2>Edit Assignment</h2>
                                <button
                                    type="button"
                                    onClick={() => setSelectedAssignment(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSave}>
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
                                    {subjects.map((subject) => (
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
                                    <button type="submit" disabled={saving}>
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedAssignment(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}


                {loading ? (
                    <p className="calendar-message">Loading calendar...</p>
                ) : error ? (
                    <p className="calendar-message error">{error}</p>
                ) : (
                    <>
                        <div className="calendar-grid calendar-weekdays">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                (day) => (
                                    <div key={day}>{day}</div>
                                )
                            )}
                        </div>

                        <div className="calendar-grid calendar-days">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day ${isToday(day) ? "today" : ""} ${day ? "" : "empty"}`}
                                >
                                    {day && (
                                        <>
                                            <span className="day-number">{day}</span>

                                            <div className="day-assignments">
                                                {getAssignmentsForDay(day).map(
                                                    (assignment) => (
                                                        <button
                                                            key={assignment.id}
                                                            type="button"
                                                            className="calendar-assignment"
                                                            title="Click to edit assignment"
                                                            onClick={() => handleEdit(assignment)}
                                                            style={{
                                                                backgroundColor: "#F7F3FA",
                                                                borderLeft: "3px solid " + (assignment.colour || "#B69ACF"),
                                                                color: "#494252",
                                                                width: "100%",
                                                                textAlign: "left",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            {assignment.title}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Calendar;