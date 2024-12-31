const express=require('express');
const app=express();
const connectDB=require('./config/database');

const User=require('./models/user');


require('./config/database');
app.use(express.json());

app.post('/signup',async(req,res)=>{
    
    const newuser= new User(req.body);
    try{
        await newuser.save();
        //console.log(newuser)
        res.send("user created")
    }catch(err){
        console.log(err);
    }
  
})

app.get('/user',async(req,res)=>{
    const useremail=req.body.emailId;
    try{
        const users=await User.findOne({emailId:useremail});
       if(!users){
        res.send("user does not exist")
       }
        console.log(users);
        res.send(users);
    }catch(err){
        res.send(err);
    }
})


app.get('/feed',async(req,res)=>{
    try {
        const allUsers = await User.find({});
        
        
        res.status(200).json(allUsers); // Use JSON response with status code
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ error: "Internal Server Error" }); // Send error response
    }
    
})

app.delete('/user',async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete({_id:userId});
        res.send("user delted")
    }catch(err){
        console.log(err);
    }
})

app.patch('/user',async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;

   
    try{
        const Allowed_updates=[
            "photoUrl","about","age","skiils"
        ]
        const isUpdateAllowed=Object.keys(data).every((k)=>{
            Allowed_updates.includes(k)
        })
        if(!isUpdateAllowed){
            throw new Error("update not allowed")
        }
        const user=await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true
        });
        res.send("user updated successfully")


    }catch(err){
        console.log(err);
    }
})


connectDB().then(()=>{
    console.log("db connected successfully");
    
app.listen(4080,(req,res)=>{
    console.log("server started at port no 4080")
})
}).catch((err)=>{
    console.log(err);
})


