
import React, { useState, useEffect } from "react";
import Members from "./pages/Members";
import Expenses from "./pages/Expenses";
import Balances from "./pages/Balances";
import "./App.css";

function App() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("tripSplitMembers");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("tripSplitExpenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [page, setPage] = useState("home");

  useEffect(() => {
    localStorage.setItem("tripSplitMembers", JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem("tripSplitExpenses", JSON.stringify(expenses));
  }, [expenses]);

  return (
    <div className="app">
      <header className="header">
        <h1>TripSplit</h1>
        <p>Split expenses. Travel together.</p>
      </header>

      <nav className="navbar">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          className={page === "members" ? "active" : ""}
          onClick={() => setPage("members")}
        >
          Members
        </button>

        <button
          className={page === "expenses" ? "active" : ""}
          onClick={() => setPage("expenses")}
        >
          Expenses
        </button>
      </nav>

      <main>
        {page === "home" && (
          <Balances
            members={members}
            expenses={expenses}
          />
        )}

        {page === "members" && (
          <Members
            members={members}
            setMembers={setMembers}
            expenses={expenses}
          />
        )}

        {page === "expenses" && (
          <Expenses
            members={members}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        )}
      </main>
    </div>
  );
}

export default App;
