const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

//middlewire
app.use(cors());
app.use(express.json());






var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.5rqsj.mongodb.net:27017,cluster0-shard-00-01.5rqsj.mongodb.net:27017,cluster0-shard-00-02.5rqsj.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-nfkh05-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("emaJhon").collection("product");
//     // perform actions on the collection object
//     console.log('mongo is connected');
//     client.close();
// });

async function run() {

    try {
        await client.connect();
        const productCollection = client.db('emaJhon').collection('product');


        app.get('/product', async (req, res) => {
            // console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            } else {
                products = await cursor.toArray();
            }

            res.send(products);
        });

        app.get('/productCount', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        });

        //use post to get progucts by ids
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })

    } finally {

    }

}



run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("jhon is running and waiting for ema");
})

app.listen(port, () => {
    console.log("jhon is running on port:", port);
});

