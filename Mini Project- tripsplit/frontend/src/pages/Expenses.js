
import React, { useState } from "react";

function Expenses({ members, expenses, setExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [error, setError] = useState("");

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const share = members.length > 0 ? total / members.length : 0;

  function addExpense(e) {
    e.preventDefault();

    const value = Number(amount);

    if (!title.trim()) {
      setError("Please enter an expense name.");
      return;
    }

    if (
      amount.trim() === "" ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (members.length === 0) {
      setError("Add members before recording expenses.");
      return;
    }

    const payerId = Number(paidBy);

    if (!members.some((member) => member.id === payerId)) {
      setError("Please select who paid.");
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now() + Math.random(),
        title: title.trim(),
        amount: Math.round(value * 100) / 100,
        paidBy: payerId
      }
    ]);

    setTitle("");
    setAmount("");
    setPaidBy("");
    setError("");
  }

  return (
    <section className="section">
      <div className="page-heading">
        <div>
          <h2>Add Trip Expense</h2>
          <p>Record food, hotels, fuel and other costs.</p>
        </div>
      </div>

      <div className="summary">
        <div className="summary-card">
          <span>Total Expenses</span>
          <h3>₹{total.toFixed(2)}</h3>
        </div>

        <div className="summary-card">
          <span>Members</span>
          <h3>{members.length}</h3>
        </div>

        <div className="summary-card">
          <span>Share Per Person</span>
          <h3>₹{share.toFixed(2)}</h3>
        </div>
      </div>

      <div className="card">
        <form className="expense-form" onSubmit={addExpense}>
          <div className="form-group">
            <label htmlFor="expense-title">Expense Name</label>
            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Hotel, Food, Fuel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense-amount">Amount (₹)</label>
            <input
              id="expense-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense-payer">Paid By</label>
            <select
              id="expense-payer"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Save Expense</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}

export default Expenses;
