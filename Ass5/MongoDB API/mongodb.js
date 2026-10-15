const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

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
    res.send(data);
});

app.post("/students", async (req, res) => {
    await students.insertOne(req.body);
    res.send("Student Added");
});

app.put("/students/:id", async (req, res) => {
    const { ObjectId } = require("mongodb");

    await students.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    );

    res.send("Student Updated");
});

app.delete("/students/:id", async (req, res) => {
    const { ObjectId } = require("mongodb");

    await students.deleteOne({
        _id: new ObjectId(req.params.id)
    });

    res.send("Student Deleted");
});

main();