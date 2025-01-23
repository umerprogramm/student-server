const express = require('express')
const bodyParser = require('body-parser')
const app =  express() 
const cors = require('cors')
const { MongoClient } = require('mongodb')

app.use(bodyParser.json())
app.use(cors())
let uri = "mongodb+srv://umer:umer123@cluster0.cyhcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri);


async function databasecon(){
   await client.connect();
   console.log("Connected to MongoDB Atlas!");
}

databasecon()


app.post('/signup' ,async (req , res)=>{

    let db = client.db("ecom")
    let user = await db.collection("user").insertOne(req.body)
    console.log(user);
    if(user.acknowledged == true)    {
             res.json({
            status : 201,
         })
    }
    
    
})


app.post('/login' ,async (req , res)=>{
    const { email , pass} = req.body
    let db = client.db("ecom")
    try {
        let user = await db.collection("user").findOne({ email: email, password: pass });
      
        if (user) {
          res.json({ success: true, message: "User found", user });
        } else {
          res.json({ success: false, message: "Invalid email or password" });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
      }
    

})





app.listen(3000 , function(){
    console.log('server is running....')
})

