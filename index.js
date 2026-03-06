require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const serverless = require("serverless-http");

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsjvgaa.mongodb.net/Innovation_db?retryWrites=true&w=majority`;

let cachedClient = null;
let cachedDb = null;

async function getDB() {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db("Innovation_db");
  return cachedDb;
}

// Root
app.get("/", (req, res) => {
  res.send("🚀 Innovation Server Running");
});

// CRUD routes
app.post("/products", async (req, res) => {
  try {
    const db = await getDB();
    const result = await db.collection("product_details").insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Insert failed" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const db = await getDB();
    const result = await db.collection("product_details").find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const db = await getDB();
    const result = await db
      .collection("product_details")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Fetch single failed" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const db = await getDB();
    const result = await db
      .collection("product_details")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }, { upsert: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const db = await getDB();
    const result = await db
      .collection("product_details")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// Export for Vercel
module.exports = serverless(app);