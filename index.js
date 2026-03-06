require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsjvgaa.mongodb.net/Innovation_db?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let all_products;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("Innovation_db");
    all_products = db.collection("product_details");

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();


// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Innovation Server Running");
});


// Create Product
app.post("/products", async (req, res) => {
  try {
    const result = await all_products.insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Insert failed" });
  }
});


// Get All Products
app.get("/products", async (req, res) => {
  try {
    const result = await all_products.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});


// Get Single Product
app.get("/products/:id", async (req, res) => {
  try {
    const result = await all_products.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Fetch single failed" });
  }
});


// Update Product
app.put("/products/:id", async (req, res) => {
  try {
    const result = await all_products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { upsert: true }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});


// Delete Product
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await all_products.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});


// Export for Vercel
module.exports = app;