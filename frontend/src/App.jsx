import { useEffect, useState } from "react";
import { getWelcomeMessage } from "./services/api";

function App() {
    const [message, setMessage] = useState("Connecting to StudyFlow...");
    const [error, setError] = useState("");

    useEffect(() => {
        async function connectToBackend() {
            try {
                const data = await getWelcomeMessage();
                setMessage(data.message);
            } catch (err) {
                setError(err.message);
            }
        }

        connectToBackend();
    }, []);

    return (
        <div>
            <h1>StudyFlow</h1>
            <p>Your personal student productivity dashboard.</p>

            {error ? (
                <p>{error}</p>
            ) : (
                <p>Backend response: {message}</p>
            )}
        </div>
    );
}

export default App;