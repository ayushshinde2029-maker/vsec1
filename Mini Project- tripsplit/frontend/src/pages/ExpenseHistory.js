
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function ExpenseHistory() {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState("");

    const loadExpenses = async () => {
        try {
            const response = await fetch(`${API}/expenses`);

            if (!response.ok) {
                throw new Error();
            }

            setExpenses(await response.json());
            setError("");
        } catch {
            setError("Could not load expenses. Check your backend.");
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(
                `${API}/expenses/${id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error();
            }

            loadExpenses();
        } catch {
            setError("Could not delete the expense.");
        }
    };

    return (
        <section className="card">
            <h2>Expense History</h2>

            {error && <p className="red">{error}</p>}

            {expenses.length === 0 && !error && (
                <p>No expenses yet.</p>
            )}

            {expenses.map(e => (
                <div className="expense" key={e.id}>
                    <div>
                        <strong>{e.title}</strong>
                        <p>Paid by {e.paidBy}</p>
                    </div>

                    <div className="right">
                        <strong>₹{e.amount.toFixed(2)}</strong>
                        <button
                            className="delete"
                            onClick={() => deleteExpense(e.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </section>
    );
}

export default ExpenseHistory;
