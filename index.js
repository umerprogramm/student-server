const express = require('express')
const bodyParser = require('body-parser')
const app =  express() 
const cors = require('cors')
const { MongoClient } = require('mongodb')
var nodemailer = require('nodemailer');


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
    console.log(req.body);
    

    let db = client.db("ecom")
    let find = await db.collection("user").findOne({email : req.body.email})
    
    if(find){
      res.json({
        message : "user already exist"
      })
    }else{
      let user = await db.collection("user").insertOne(req.body)
      console.log(user);
      if(user.acknowledged == true)    {
               res.json({
              status : 201,
           })
      }
    }
   
    
    
})


app.post('/login' ,async (req , res)=>{
    const { email , pass} = req.body
    let db = client.db("ecom")
    try {
        let user = await db.collection("user").findOne({ email: email, password: pass });
      
        if (user) {
          res.json({ success: true, message: "User found" });
        } else {
          res.json({ success: false, message: "Invalid email or password" });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred", error: err.message });
      }
    

})


app.post('/forget', (req , res)=>{
  const { email } = req.body
  let ottp = Math.round(Math.random()*1000)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'umerprogrammmer@gmail.com',
           pass: 'yourpassword'
       }
   });

   const mailOptions = {
    from: 'umerprogrammer@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'your OTTP', // Subject line
    html: `<p>Your ottp is ${ottp} </p>`// plain text body
  };


  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
 
 })


 app.post("/addproduct" ,async (req , res)=>{
  let db = client.db("ecom")
  console.log(req.body);
  
  let user = await db.collection("product").insertOne(req.body)
  if(user.acknowledged == true)   {
    res.json({
      message : "data has been added"
    })
  } 

 })


 app.get('/allproducts' , async(req , res)=>{
  let db = client.db("ecom")
  let user = await db.collection("product").find().toArray()
  res.send(user)

 })
app.post('/buy' , async(req , res)=>{
  let db = client.db("ecom")
  let user = await db.collection("order").insertOne(req.body)
  if(user.acknowledged == true)   {
    res.json({
      message : "Thanks for your order we will contact you soon"
    })
  } else{
    res.json({
      message : "Ops something went wrong"
    })
  }
})
app.post('/detail' , async(req ,res) =>{
  const query = req.body.query
  console.log(query);
  
  let db = client.db("ecom")
  let product =await db.collection("product").findOne({title :query })  
  console.log(product);
   res.json(product)
})

app.post('/order' , async (req , res)=>{
  console.log(req.body.email);
  
  let db = client.db("ecom")
  let order =await db.collection("order").find({seller : req.body.email}).toArray()  
  console.log(order);
  
  res.json(order)


})

app.listen(3000 ,async function(){
    console.log('server is running....')
})


