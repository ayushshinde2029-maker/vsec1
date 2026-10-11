
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [total, setTotal] = useState(0);
    const [title, setTitle] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [amount, setAmount] = useState("");

    const loadData = async () => {
        const m = await fetch("http://localhost:5000/members").then(r => r.json());
        const e = await fetch("http://localhost:5000/expenses").then(r => r.json());
        const b = await fetch("http://localhost:5000/balances").then(r => r.json());

        setMembers(m);
        setExpenses(e);
        setBalances(b.balances);
        setTotal(b.total);
        setPaidBy(old => m.includes(old) ? old : m[0] || "");
    };

    useEffect(() => {
        loadData();
    }, []);

    const addExpense = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                paidBy,
                amount: Number(amount)
            })
        });

        if (response.ok) {
            setTitle("");
            setAmount("");
            loadData();
        }
    };

    const deleteExpense = async (id) => {
        await fetch(`http://localhost:5000/expenses/${id}`, {
            method: "DELETE"
        });

        loadData();
    };

    return (
        <div className="app">
            <header>
                <h1>TripSplit</h1>
                <p>Travel together. Split expenses easily.</p>
            </header>

            <div className="total">
                <p>Total Trip Expenses</p>
                <h2>₹{total.toFixed(2)}</h2>
            </div>

            <div className="content">
                <section className="card">
                    <h2>Add Expense</h2>

                    <form onSubmit={addExpense}>
                        <label>Expense Name</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Hotel, food, fuel..."
                            required
                        />

                        <label>Paid By</label>
                        <select
                            value={paidBy}
                            onChange={e => setPaidBy(e.target.value)}
                            required
                        >
                            {members.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />

                        <button disabled={!members.length}>Add Expense</button>
                    </form>
                </section>

                <section className="card">
                    <h2>Expense History</h2>

                    {expenses.length === 0 && <p>No expenses yet.</p>}

                    {expenses.map(e => (
                        <div className="expense" key={e.id}>
                            <div>
                                <strong>{e.title}</strong>
                                <p>Paid by {e.paidBy}</p>
                            </div>
                            <div className="right">
                                <strong>₹{e.amount.toFixed(2)}</strong>
                                <button className="delete" onClick={() => deleteExpense(e.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>

            <section className="card">
                <h2>Member Balances</h2>

                {balances.map(b => (
                    <div className="balance" key={b.name}>
                        <div>
                            <strong>{b.name}</strong>
                            <p>Paid ₹{b.paid.toFixed(2)}</p>
                        </div>
                        <strong className={b.balance >= 0 ? "green" : "red"}>
                            {b.balance >= 0 ? "+" : "-"}₹{Math.abs(b.balance).toFixed(2)}
                        </strong>
                    </div>
                ))}

                <p className="note">
                    Positive means paid more than their share. Negative means paid less.
                </p>
            </section>
        </div>
    );
}

export default App;
