
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Members from "./pages/Members";
import Expenses from "./pages/Expenses";
import "./App.css";

function App() {
    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>TripSplit</h1>
                    <p>Manage your trip expenses easily</p>
                </div>
                <span className="tag">Travel Expense Manager</span>
            </header>

            <nav className="navbar">
                <NavLink to="/members">Members</NavLink>
                <NavLink to="/expenses">Expenses</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/members" replace />} />
                <Route path="/members" element={<Members />} />
                <Route path="/expenses" element={<Expenses />} />
            </Routes>

            <footer>TripSplit | Simple Travel Expense Management</footer>
        </div>
    );
}

export default App;
