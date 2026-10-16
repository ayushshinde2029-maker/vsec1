
import React from "react";

function Balances({ members, expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const share = members.length ? total / members.length : 0;

  const balances = members.map((member) => {
    const paid = expenses
      .filter((expense) => expense.paidBy === member.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      ...member,
      paid,
      balance: paid - share
    };
  });

  function calculateSettlements() {
    const debtors = balances
      .filter((member) => member.balance < -0.005)
      .map((member) => ({
        name: member.name,
        remaining: -member.balance
      }));

    const creditors = balances
      .filter((member) => member.balance > 0.005)
      .map((member) => ({
        name: member.name,
        remaining: member.balance
      }));

    const transfers = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(
        debtors[i].remaining,
        creditors[j].remaining
      );

      if (amount > 0.005) {
        transfers.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amount: Math.round(amount * 100) / 100
        });
      }

      debtors[i].remaining -= amount;
      creditors[j].remaining -= amount;

      if (debtors[i].remaining < 0.005) i++;
      if (creditors[j].remaining < 0.005) j++;
    }

    return transfers;
  }

  const settlements = calculateSettlements();

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

      <div className="card">
        <h3 className="card-title">Who Pays Whom?</h3>

        {members.length < 2 || settlements.length === 0 ? (
          <p className="hint">
            {members.length < 2
              ? "Add at least two members to calculate settlements."
              : "Everyone is settled up!"}
          </p>
        ) : (
          <div className="settlement-list">
            {settlements.map((settlement, index) => (
              <div className="settlement-item" key={index}>
                <div className="settlement-description">
                  <strong>{settlement.from}</strong>
                  <span> pays </span>
                  <strong>{settlement.to}</strong>
                </div>

                <strong className="settlement-amount">
                  ₹{settlement.amount.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Balances;
