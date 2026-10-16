
import React, { useState } from "react";

function Members({ members, setMembers, expenses }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function addMember(e) {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Please enter a member name.");
      return;
    }

    if (members.length >= 10) {
      setError("Maximum 10 members allowed.");
      return;
    }

    if (
      members.some(
        (member) =>
          member.name.toLowerCase() === cleanName.toLowerCase()
      )
    ) {
      setError("This member already exists.");
      return;
    }

    setMembers([
      ...members,
      {
        id: Date.now() + Math.random(),
        name: cleanName
      }
    ]);

    setName("");
    setError("");
  }

  function removeMember(id) {
    const hasExpenses = expenses.some(
      (expense) => expense.paidBy === id
    );

    if (hasExpenses) {
      setError(
        "Delete this member's expenses before removing them."
      );
      return;
    }

    setMembers(members.filter((member) => member.id !== id));
    setError("");
  }

  return (
    <section className="section">
      <div className="page-heading">
        <div>
          <h2>Trip Members</h2>
          <p>Manage the people joining your trip.</p>
        </div>
        <span className="count">{members.length}/10 members</span>
      </div>

      <div className="card">
        <form className="member-form" onSubmit={addMember}>
          <input
            type="text"
            placeholder="Enter member name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />

          <button type="submit" disabled={members.length >= 10}>
            + Add Member
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="member-list">
          {members.length === 0 ? (
            <p className="hint">No members added yet.</p>
          ) : (
            members.map((member) => (
              <div className="member-item" key={member.id}>
                <div className="avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <strong className="member-name">
                  {member.name}
                </strong>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeMember(member.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Members;
