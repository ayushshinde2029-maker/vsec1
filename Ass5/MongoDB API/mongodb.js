const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");

let students;

async function main() {
    await client.connect();

    const db = client.db("studentsDB");
    students = db.collection("students");

    console.log("MongoDB Connected");

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

app.get("/students", async (req, res) => {
    const data = await students.find().toArray();
    res.json(data);
});

app.post("/students", async (req, res) => {
    const result = await students.insertOne(req.body);
    res.json({ message: "Student added", id: result.insertedId });
});

app.put("/students/:name", async (req, res) => {
    const result = await students.updateOne(
        { name: req.params.name },
        { $set: req.body }
    );
    res.json({ message: "Student updated", modified: result.modifiedCount });
});

app.delete("/students/:name", async (req, res) => {
    const result = await students.deleteOne({ name: req.params.name });
    res.json({ message: "Student deleted", deleted: result.deletedCount });
});

main().catch(console.error);