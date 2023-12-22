const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express()
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdvzwaw.mongodb.net/?retryWrites=true&w=majority`;

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

    const addData=client.db('Taskmanager').collection('Addedtask');
    const completeData=client.db('Taskmanager').collection("CompleteTask");

    app.get('/addtask/data/:email', async (req,res) => {
        const email=req.params.email;
        // console.log(email);
        const query={ email :email};
        const result=await addData.find(query).toArray();
        res.send(result);
       })


       app.get('/task/data/:id', async (req,res) => {
        const id = req.params.id;
        const query = { _id :new ObjectId(id) };
        const result = await addData.findOne(query);
        res.send(result);
       })
    

    app.post('/addtask/data',async (req,res)=>{
        const adtask=req.body;
       //  console.log(wishlist);
       const result=await addData.insertOne(adtask);
       res.send(result)
     } )

    
     app.delete('/addtask/data/:id',async(req,res)=>{
        const id=req.params.id;
        const query={ _id :new ObjectId(id)}
        const result=await addData.deleteOne(query);
        res.send(result)
       })

       app.put('/updateddata/task/:id',async(req,res)=>{
        const id=req.params.id;
        const filter={_id: new ObjectId(id)}
        const options={ upsert :true}
        const updatedata=req.body;
         const dataupdate= {
      
          $set:{
            email:updatedata.email,
            Cat:updatedata.Cat,
            Des:updatedata.Des,
            Priority:updatedata.Priority,
            Title:updatedata.Title,
          }
        }
        const result=await addData.updateOne(filter, dataupdate,options)
        res.send(result)
      })
       
      // commmmm

       app.get('/com/data/:email', async (req,res) => {
        const email=req.params.email;
        // console.log(email);
        const query={ email :email};
        const result=await completeData.find(query).toArray();
        res.send(result);
       })
    

      
       app.post('/com/data',async (req,res)=>{
        const comtask=req.body;
       //  console.log(wishlist);
       const result=await completeData.insertOne(comtask);
       res.send(result)
     } )

     app.put('/person/data', async (req, res) => {
      const updateData = req.body;
    
      const result = await addData.updateMany({}, { $set:{
        name:updateData.name,
      

      } });
      res.send(result);
    });


    //  app.put('/com/datatask/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const filter={_id: new ObjectId(id)}
    //   const options={ upsert :true}
    //   const updatedata=req.body;
    //    const dataupdate= {
    
    //     $set:{
    //       Dead:updatedata.Dead,
    //       Cat:updatedata.Cat,
    //       Des:updatedata.Des,
    //       Priority:updatedata.Priority,
    //       Title:updatedata.Title,
    //     }
    //   }
    //   const result=await addData.updateOne(filter, dataupdate,options)
    //   res.send(result)
    // })


    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/",(req,res)=>{
    res.send("Task manager is woking");
})

app.listen(port,()=>{
    console.log(`Task server is runnning on ${port}`);
})