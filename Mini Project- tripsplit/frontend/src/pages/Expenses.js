
import React, { useState } from "react";

function Expenses({ members, expenses, setExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  function addExpense(e) {
    e.preventDefault();

    if (!title || !amount || !paidBy || Number(amount) <= 0) {
      alert("Please fill all details");
      return;
    }

    const expense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      paidBy
    };

    setExpenses([...expenses, expense]);

    setTitle("");
    setAmount("");
    setPaidBy("");
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  return (
    <section className="section">
      <div className="page-heading">
        <div>
          <h2>Expenses</h2>
          <p>Add and manage your trip expenses.</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Add Expense</h3>

        {members.length === 0 ? (
          <p className="hint">Please add members first.</p>
        ) : (
          <form onSubmit={addExpense} className="expense-form">
            <input
              type="text"
              placeholder="Expense name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />

            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            >
              <option value="">Who paid?</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <button type="submit">Add Expense</button>
          </form>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">All Expenses</h3>

        {expenses.length === 0 ? (
          <p className="hint">No expenses added yet.</p>
        ) : (
          <div className="expense-list">
            {expenses.map((expense) => {
              const member = members.find(
                (m) => String(m.id) === String(expense.paidBy)
              );

              return (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-details">
                    <strong>{expense.title}</strong>
                    <span>
                      Paid by {member ? member.name : "Unknown"}
                    </span>
                    <strong>₹{expense.amount.toFixed(2)}</strong>
                  </div>

                  <div className="expense-actions">
                    <button
                      type="button"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Expenses;
