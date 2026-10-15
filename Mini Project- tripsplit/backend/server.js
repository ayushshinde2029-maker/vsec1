
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB configuration
const client = new MongoClient(
    "mongodb://127.0.0.1:27017"
);

let db;
let membersCollection;
let expensesCollection;

// Home route
app.get("/", (req, res) => {
    res.send("TripSplit Backend is Running with MongoDB!");
});

// Get all members
app.get("/members", async (req, res) => {
    try {
        const members = await membersCollection
            .find({})
            .toArray();

        res.json(members.map(member => member.name));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

// Add a member
app.post("/members", async (req, res) => {
    try {
        const name = req.body.name?.trim();

        if (!name) {
            return res.status(400).json({
                message: "Member name is required"
            });
        }

        const existing = await membersCollection.findOne({
            name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
        });

        if (existing) {
            return res.status(409).json({
                message: "Member already exists"
            });
        }

        await membersCollection.insertOne({
            name,
            createdAt: new Date()
        });

        const members = await membersCollection
            .find({})
            .toArray();

        res.status(201).json(members.map(m => m.name));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add member" });
    }
});

// Get all expenses
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await expensesCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(expenses.map(e => ({
            id: e._id.toString(),
            title: e.title,
            paidBy: e.paidBy,
            amount: e.amount
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch expenses" });
    }
});

// Add an expense
app.post("/expenses", async (req, res) => {
    try {
        const { title, paidBy, amount } = req.body;
        const numericAmount = Number(amount);

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof paidBy !== "string" ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                message: "Enter a valid title, member and amount"
            });
        }

        const member = await membersCollection.findOne({
            name: paidBy
        });

        if (!member) {
            return res.status(400).json({
                message: "Selected member does not exist"
            });
        }

        const expense = {
            title: title.trim(),
            paidBy,
            amount: numericAmount,
            createdAt: new Date()
        };

        const result = await expensesCollection.insertOne(expense);

        res.status(201).json({
            id: result.insertedId.toString(),
            title: expense.title,
            paidBy: expense.paidBy,
            amount: expense.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add expense" });
    }
});

// Delete an expense
app.delete("/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const result = await expensesCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete expense" });
    }
});

// Calculate balances
app.get("/balances", async (req, res) => {
    try {
        const members = await membersCollection
            .find({})
            .toArray();

        const expenses = await expensesCollection
            .find({})
            .toArray();

        const total = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );

        const share = members.length
            ? total / members.length
            : 0;

        const balances = members.map(member => {
            const paid = expenses
                .filter(e => e.paidBy === member.name)
                .reduce((sum, e) => sum + e.amount, 0);

            return {
                name: member.name,
                paid,
                balance: paid - share
            };
        });

        res.json({ total, share, balances });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to calculate balances" });
    }
});

// Connect to MongoDB, then start the server
async function startServer() {
    try {
        await client.connect();

        db = client.db("tripsplit");
        membersCollection = db.collection("members");
        expensesCollection = db.collection("expenses");

        // Add default members only when the collection is empty
        const memberCount = await membersCollection.countDocuments();

        if (memberCount === 0) {
            await membersCollection.insertMany([
                { name: "Ayush", createdAt: new Date() },
                { name: "Rahul", createdAt: new Date() },
                { name: "Aman", createdAt: new Date() }
            ]);
        }

        app.listen(PORT, () => {
            console.log(`TripSplit server running at http://localhost:${PORT}`);
            console.log("MongoDB database: tripsplit");
        });
    } catch (error) {
        console.error("Failed to start TripSplit:", error);
        await client.close().catch(() => {});
        process.exitCode = 1;
    }
}

startServer();
