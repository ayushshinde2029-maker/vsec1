
import { Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseHistory from "./pages/ExpenseHistory";
import Balances from "./pages/Balances";
import Members from "./pages/Members";

function App() {
    return (
        <div className="app">
            <header>
                <h1>TripSplit</h1>
                <p>Travel together. Split expenses easily.</p>
            </header>

            <nav className="navbar">
                <Link to="/">Dashboard</Link>
                <Link to="/add-expense">Add Expense</Link>
                <Link to="/expenses">Expense History</Link>
                <Link to="/balances">Balances</Link>
                <Link to="/members">Members</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/expenses" element={<ExpenseHistory />} />
                <Route path="/balances" element={<Balances />} />
                <Route path="/members" element={<Members />} />
            </Routes>
        </div>
    );
}

export default App;
