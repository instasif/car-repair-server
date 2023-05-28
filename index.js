const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PROT || 5000;

//!-------------- middlewares
app.use(cors());
app.use(express.json());

//!------------- Mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lbo3hl.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const servicesCollection = client.db("geniusCar").collection("services");
    const ordersCollection = client.db("geniusCar").collection("orders");

    //?-----------to get all the services
    app.get("/services", async (req, res) => {
      try {
        const services = await servicesCollection.find({}).toArray();
        res.send(services);
      } catch (error) {
        res.send(error.message);
      }
    });

    //?----------to get on specific id service for the details page
    app.get("/services/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.send(service);
      } catch (error) {
        res.send(error.message);
      }
    });

    // ?-------- orders post api
    app.post("/orders", async (req, res) => {
      try {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    // ?------- orders api of single user
    app.get("/orders", async (req, res) => {
      try {
        let query = {};
        if (req.query.email) {
          query = {
            email: req.query.email,
          };
        }
        const orders = await ordersCollection.find(query).toArray();
        res.send(orders);
      } catch (error) {
        res.send(error.message);
      }
    });

    // ?------- all orders api
    app.get("/all-orders", async (req, res) => {
      try {
        const orders = await ordersCollection.find({}).toArray();
        res.send(orders);
      } catch (error) {
        res.send(error.message);
      }
    });

    //?-------- delete a order
    app.delete("/orders/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });

    //?------- update status of order
    app.patch("/orders/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const status = req.body.status;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: status,
          },
        };
        const result = await ordersCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.send(error.message);
      }
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("genius car server is running.....");
});

app.listen(port, () => {
  console.log(`genius car server running on port ${port}`);
});
