require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

async function run() {
    try {
        await client.connect();

        const all_products = client
            .db("Innovation_db")
            .collection("product_details");

        app.post("/products", async (req, res) => {
            const newProducts = req.body;
            const result = await all_products.insertOne(newProducts);
            res.send(result);
        });

        app.get("/products", async (req, res) => {
            const result = await all_products.find().toArray();
            res.send(result);
        });

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await all_products.findOne(query);
            res.send(result);
        });

        app.put("/edit-product/:id", async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;

            const filter = { _id: new ObjectId(id) };

            const updateDoc = {
                $set: updateProduct,
            };

            const options = { upsert: true };

            const result = await all_products.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await all_products.deleteOne(query);
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB");
    } finally {
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Started Innovation Server");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});