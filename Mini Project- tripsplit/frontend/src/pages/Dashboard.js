
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

function Dashboard() {
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [members, setMembers] = useState(0);

    useEffect(() => {
        Promise.all([
            fetch(`${API}/balances`).then(r => r.json()),
            fetch(`${API}/expenses`).then(r => r.json()),
            fetch(`${API}/members`).then(r => r.json())
        ]).then(([b, e, m]) => {
            setTotal(b.total);
            setCount(e.length);
            setMembers(m.length);
        });
    }, []);

    return (
        <section className="card">
            <h2>Trip Dashboard</h2>

            <div className="total">
                <p>Total Trip Expenses</p>
                <h2>₹{total.toFixed(2)}</h2>
            </div>

            <p>Total Expenses: {count}</p>
            <p>Trip Members: {members}</p>

            <div className="page-links">
                <Link to="/add-expense">Add Expense</Link>
                <Link to="/expenses">View Expenses</Link>
                <Link to="/balances">Check Balances</Link>
                <Link to="/members">Manage Members</Link>
            </div>
        </section>
    );
}

export default Dashboard;
