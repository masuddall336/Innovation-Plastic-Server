const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PROT || 3000;
const { MongoClient, ServerApiVersion, Long } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://Innovation-Plastic:RS9bv1QJqnzMhtAD@cluster0.wsjvgaa.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const all_products = client.db('Innovation_db').collection('product_details');
        app.post('/products', async (req, res) => {
            const newPrducts = req.body;
            console.log(newPrducts);
            const ras = await all_products.insertOne(newPrducts);
            res.send(ras)
        })
        app.get('/products', async (req, res) => {
            const ras = await all_products.find().toArray();
            res.send(ras);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Started Innovation Server')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// Innovation-Plastic
// RS9bv1QJqnzMhtAD