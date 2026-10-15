
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function Expenses() {
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [error, setError] = useState("");

    async function loadData() {
        try {
            const memberResponse = await fetch(`${API}/members`);
            const expenseResponse = await fetch(`${API}/expenses`);

            if (!memberResponse.ok || !expenseResponse.ok) {
                throw new Error();
            }

            const memberData = await memberResponse.json();
            const expenseData = await expenseResponse.json();

            setMembers(memberData);
            setExpenses(expenseData);

            if (memberData.length > 0) {
                setPaidBy(current =>
                    memberData.some(m => m.name === current)
                        ? current
                        : memberData[0].name
                );
            } else {
                setPaidBy("");
            }

            setError("");
        } catch {
            setError("Could not load data. Check the backend.");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addExpense(e) {
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
                    amount,
                    paidBy
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setTitle("");
            setAmount("");
            await loadData();
        } catch (error) {
            setError(error.message || "Could not add expense.");
        }
    }

    const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    return (
        <main>
            <div className="page-heading">
                <div>
                    <h2>Trip Expenses</h2>
                    <p>Record and track your travel spending.</p>
                </div>
            </div>

            <div className="summary">
                <div className="summary-card">
                    <p>Total Expenses</p>
                    <h2>₹{total.toFixed(2)}</h2>
                </div>

                <div className="summary-card">
                    <p>Number of Expenses</p>
                    <h2>{expenses.length}</h2>
                </div>
            </div>

            {error && <p className="error">{error}</p>}

            <section className="card">
                <h3>Add New Expense</h3>

                <form onSubmit={addExpense}>
                    <label>Expense Name</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Hotel, food, fuel..."
                        required
                    />

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

                    <label>Paid By</label>
                    <select
                        value={paidBy}
                        onChange={e => setPaidBy(e.target.value)}
                        required
                    >
                        <option value="">Select member</option>
                        {members.map(member => (
                            <option key={member._id} value={member.name}>
                                {member.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" disabled={!members.length}>
                        Add Expense
                    </button>

                    {!members.length && (
                        <p className="hint">Add a member before adding expenses.</p>
                    )}
                </form>
            </section>

            <section className="card">
                <h3>Expense History</h3>

                {expenses.length === 0 && <p>No expenses added yet.</p>}

                {expenses.map(expense => (
                    <div className="expense-item" key={expense._id}>
                        <div className="expense-icon">₹</div>
                        <div className="expense-details">
                            <strong>{expense.title}</strong>
                            <p>Paid by {expense.paidBy}</p>
                        </div>
                        <strong className="amount">
                            ₹{Number(expense.amount).toFixed(2)}
                        </strong>
                    </div>
                ))}
            </section>
        </main>
    );
}

export default Expenses;
