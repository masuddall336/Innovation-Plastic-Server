
const express = require('express');
require('dotenv').config(); // Load environment variables
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
// const corsOptions = {
//   origin: 'https://www.innovation-plastic.com', // your actual domain
//   credentials: true,
// };
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@cluster0.wsjvgaa.mongodb.net/Innovation_db?retryWrites=true&w=majority`;

let cachedClient = null;
let cachedDb = null;

async function getDB() {
  if (cachedDb) return cachedDb;

  if (!process.env.DB_USER || !process.env.DB_PASS) {
    throw new Error('MongoDB credentials are missing in .env');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    cachedDb = client.db('Innovation_db');
    console.log('✅ Connected to MongoDB');
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
}

// Root endpoint
app.get('/', (req, res) => {
  res.send('🚀 Innovation Server Running Locally');
});

// CRUD routes

// Create product
app.post('/products', async (req, res) => {
  try {
    const db = await getDB();
    const result = await db.collection('product_details').insertOne(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Insert failed', details: error.message });
  }
});

// Read all products
app.get('/products', async (req, res) => {
  try {
    const db = await getDB();
    const products = await db.collection('product_details').find().toArray();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Fetch failed', details: error.message });
  }
});

// Read single product
app.get('/products/:id', async (req, res) => {
  try {
    const db = await getDB();
    const product = await db
      .collection('product_details')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching single product:', error);
    res.status(500).json({ error: 'Fetch single failed', details: error.message });
  }
});

// Update product
app.put('/products/:id', async (req, res) => {
  try {
    const db = await getDB();
    const result = await db.collection('product_details').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { upsert: true }
    );
    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  try {
    const db = await getDB();
    const result = await db.collection('product_details').deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Delete failed', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running locally on http://localhost:${PORT}`);
});