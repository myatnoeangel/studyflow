const API_URL = "http://localhost:5000";

export async function getWelcomeMessage() {
    const response = await fetch(`${API_URL}/`);

    if (!response.ok) {
        throw new Error("Failed to connect to StudyFlow API");
    }

    return response.json();
}