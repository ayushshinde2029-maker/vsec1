
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let members = ["Ayush", "Rahul", "Aman"];
let expenses = [];

app.get("/members", (req, res) => {
    res.json(members);
});

app.post("/members", (req, res) => {
    members.push(req.body.name);
    res.json(members);
});

app.get("/expenses", (req, res) => {
    res.json(expenses);
});

app.post("/expenses", (req, res) => {
    const expense = {
        id: Date.now(),
        title: req.body.title,
        paidBy: req.body.paidBy,
        amount: Number(req.body.amount)
    };

    expenses.push(expense);
    res.json(expense);
});

app.delete("/expenses/:id", (req, res) => {
    expenses = expenses.filter(e => e.id !== Number(req.params.id));
    res.json(expenses);
});

app.get("/balances", (req, res) => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const share = members.length ? total / members.length : 0;

    const balances = members.map(name => {
        const paid = expenses
            .filter(e => e.paidBy === name)
            .reduce((sum, e) => sum + e.amount, 0);

        return { name, paid, balance: paid - share };
    });

    res.json({ total, share, balances });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
