const express=require('express');
const authRouter=express.Router();
const {validateSignupData}=require('../utils/validation');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/user');


authRouter.post('/signup',async(req,res)=>{


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


authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("user is not registered with us");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
         if(isPasswordValid){
            const token=await jwt.sign({_id:user._id},"DEV@Tinder",{expiresIn:"7d"});
            //console.log(token);

            res.cookie("token",token,{expires:new Date( Date.now()+ 8*3600000)});
            res.send("login successful")
         }else{
            throw new Error("invalid credentials")
         }
    }catch(err){
        console.log("error"+err)
    }
})

module.exports=authRouter;
