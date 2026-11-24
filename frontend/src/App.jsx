
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Subjects from "./pages/Subjects";
import Calendar from "./pages/Calendar";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/assignments" element={<Assignments />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/study-tracker" element={<h1>Study Tracker</h1>} />
                        <Route path="/subjects" element={<Subjects />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;