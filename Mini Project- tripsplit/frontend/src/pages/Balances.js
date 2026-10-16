
import React from "react";

function Balances({ members, expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const share = members.length > 0 ? total / members.length : 0;

  const balances = members.map((member) => {
    const paid = expenses
      .filter(
        (expense) => String(expense.paidBy) === String(member.id)
      )
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    return {
      ...member,
      paid,
      balance: paid - share
    };
  });

  return (
    <section className="section">
      <div className="page-heading">
        <div>
          <h2>Balances</h2>
          <p>See who owes money and who should receive it.</p>
        </div>
      </div>

      <div className="summary">
        <div className="summary-card">
          <span>Total Trip Cost</span>
          <h3>₹{total.toFixed(2)}</h3>
        </div>

        <div className="summary-card">
          <span>Total Members</span>
          <h3>{members.length}</h3>
        </div>

        <div className="summary-card">
          <span>Share Per Person</span>
          <h3>₹{share.toFixed(2)}</h3>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Individual Balances</h3>

        {members.length === 0 ? (
          <p className="hint">
            Click Members to add people and calculate balances.
          </p>
        ) : (
          <div className="balance-list">
            {balances.map((member) => (
              <div className="balance-item" key={member.id}>
                <div className="avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="balance-details">
                  <strong>{member.name}</strong>
                  <span>Paid ₹{member.paid.toFixed(2)}</span>
                </div>

                <div
                  className={
                    "balance-amount " +
                    (member.balance > 0.005
                      ? "positive"
                      : member.balance < -0.005
                      ? "negative"
                      : "settled")
                  }
                >
                  {member.balance > 0.005
                    ? `Gets ₹${member.balance.toFixed(2)}`
                    : member.balance < -0.005
                    ? `Owes ₹${Math.abs(member.balance).toFixed(2)}`
                    : "Settled"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Balances;
