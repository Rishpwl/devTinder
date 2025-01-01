const express=require('express');
const app=express();
const connectDB=require('./config/database');
const {validateSignupData}=require('./utils/validation')
const User=require('./models/user');
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');

const jwt=require('jsonwebtoken');


require('./config/database');
app.use(express.json());
app.use(cookieParser())

app.post('/signup',async(req,res)=>{


    try{
        validateSignupData(req);

        const {firstName,lastName,emailId,password}=req.body;

        const hashedPassword=await bcrypt.hash(password,10);
        
    const newuser= new User({
        firstName,lastName,emailId,
        password:hashedPassword
        });
        await newuser.save();
        //console.log(newuser)
        res.send("user created")
    }catch(err){
        console.log(err);
    }
  
})

app.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("user is not registered with us");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
         if(isPasswordValid){
            const token=await jwt.sign({_id:user._id},"DEV@Tinder");
            console.log(token);

            res.cookie("token",token);
            res.send("login successful")
         }else{
            throw new Error("invalid credentials")
         }
    }catch(err){
        console.log("error"+err)
    }
})

app.get('/profile',async(req,res)=>{
   try{
    const cookies=req.cookies;
    const {token}=cookies;
    if(!token){
        throw new Error("invalid token");
    }

    const decodedMessage=await jwt.verify(token,"DEV@Tinder")
    const {_id}=decodedMessage;

    console.log("Logged in user is : "+_id);
    const user=await User.findById(_id);
   if(!user){
    throw new Error("no user found")
   }

    res.send(user)
   }catch(err){
    console.log("error"+err);
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


