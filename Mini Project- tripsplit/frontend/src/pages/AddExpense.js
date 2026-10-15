
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function AddExpense() {
    const [members, setMembers] = useState([]);
    const [title, setTitle] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API}/members`)
            .then(r => r.json())
            .then(m => {
                setMembers(m);
                setPaidBy(m[0] || "");
            })
            .catch(() => setError("Could not load members."));
    }, []);

    const addExpense = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API}/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    paidBy,
                    amount: Number(amount)
                })
            });

            if (!response.ok) {
                throw new Error("Failed to add expense.");
            }

            navigate("/expenses");
        } catch {
            setError("Could not add expense. Check your backend.");
        }
    };

    return (
        <section className="card">
            <h2>Add Expense</h2>

            {error && <p className="red">{error}</p>}

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
                    {members.map((m, index) => (
                        <option key={`${m}-${index}`} value={m}>
                            {m}
                        </option>
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

                <button type="submit" disabled={!members.length}>
                    Add Expense
                </button>
            </form>
        </section>
    );
}

export default AddExpense;
