const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");

let members;
let expenses;

app.get("/", (req, res) => {
    res.send("TripSplit API is running");
});

app.get("/members", async (req, res) => {
    const data = await members.find().toArray();
    res.json(data);
});

app.post("/members", async (req, res) => {
    const name = req.body.name;

    if (!name || !name.trim()) {
        return res.status(400).json({ message: "Enter member name" });
    }

    await members.insertOne({ name: name.trim() });

    res.json({ message: "Member added successfully" });
});

app.get("/expenses", async (req, res) => {
    const data = await expenses.find().sort({ _id: -1 }).toArray();
    res.json(data);
});

app.post("/expenses", async (req, res) => {
    const { title, amount, paidBy } = req.body;

    if (!title || !paidBy || Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
        return res.status(400).json({ message: "Enter valid expense details" });
    }

    const expense = {
        title: title.trim(),
        amount: Number(amount),
        paidBy
    };

    await expenses.insertOne(expense);

    res.json({ message: "Expense added successfully" });
});

async function startServer() {
    await client.connect();

    const db = client.db("tripsplit");
    members = db.collection("members");
    expenses = db.collection("expenses");

    app.listen(PORT, () => {
        console.log("Server running on port 5000");
    });
}

startServer();