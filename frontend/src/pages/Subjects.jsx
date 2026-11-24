
import { useState, useEffect } from "react";
import "./Subjects.css";

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        colour: "#B69ACF"
    });

    const fetchSubjects = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/subjects");

            if (!response.ok) {
                throw new Error("Unable to load subjects");
            }

            const data = await response.json();
            setSubjects(data);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            colour: "#B69ACF"
        });
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `http://127.0.0.1:5000/api/subjects/${editingId}`
                : "http://127.0.0.1:5000/api/subjects";

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to save subject");
            }

            resetForm();
            await fetchSubjects();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (subject) => {
        setFormData({
            name: subject.name,
            colour: subject.colour || "#B69ACF"
        });

        setEditingId(subject.id);
        setShowForm(true);
        setError("");
    };

    const handleDelete = async (subject) => {
        if (!window.confirm(
            `Are you sure you want to delete "${subject.name}"?`
        )) {
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/subjects/${subject.id}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to delete subject");
            }

            await fetchSubjects();

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="subjects-page">

            <header className="subjects-header">
                <div>
                    <h1>My Subjects</h1>
                    <p>Organise your modules and keep track of your coursework.</p>
                </div>

                <button
                    className="add-subject-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    + Add Subject
                </button>
            </header>

            {error && (
                <div className="subjects-error">
                    {error}
                </div>
            )}

            {showForm && (
                <section className="subject-form-card">
                    <h2>{editingId ? "Edit Subject" : "Add New Subject"}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="subject-name">Subject Name</label>
                            <input
                                id="subject-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject-colour">Subject Colour</label>
                            <div className="colour-input">
                                <input
                                    id="subject-colour"
                                    name="colour"
                                    type="color"
                                    value={formData.colour}
                                    onChange={handleChange}
                                />
                                <span>{formData.colour}</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn"
                                onClick={resetForm}>
                                Cancel
                            </button>

                            <button type="submit" className="save-subject-btn">
                                {editingId ? "Save Changes" : "Create Subject"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {loading ? (
                <p className="subjects-empty">Loading subjects...</p>
            ) : subjects.length === 0 ? (
                <div className="subjects-empty">
                    <h2>No subjects yet</h2>
                    <p>Add your first subject to get started!</p>
                </div>
            ) : (
                <div className="subjects-grid">
                    {subjects.map(subject => (
                        <article className="subject-card" key={subject.id}>
                            <div
                                className="subject-colour-bar"
                                style={{ backgroundColor: subject.colour }}
                            />

                            <div className="subject-card-content">
                                <div className="subject-card-heading">
                                    <h2>{subject.name}</h2>
                                    <span
                                        className="subject-colour-dot"
                                        style={{ backgroundColor: subject.colour }}
                                    />
                                </div>

                                <p className="subject-assignment-count">
                                    {subject.assignment_count}{" "}
                                    {subject.assignment_count === 1
                                        ? "assignment"
                                        : "assignments"}
                                </p>

                                <div className="subject-card-actions">
                                    <button
                                        className="edit-subject-btn"
                                        onClick={() => handleEdit(subject)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-subject-btn"
                                        onClick={() => handleDelete(subject)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Subjects;