const express=require('express');
const authRouter=express.Router();
const {validateSignupData}=require('../utils/validation');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/user');


authRouter.post("/signup", async (req, res) => {
    try {
      // Validation of data
      validateSignupData(req);
  
      const { firstName, lastName, emailId, password } = req.body;
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      //console.log(passwordHash);
  
      //   Creating a new instance of the User model
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      const savedUser = await user.save();
      const token = await savedUser.getJWT();
  
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
  
      res.json({ message: "User Added successfully!", data: savedUser });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

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
            res.send(user);
        
         }else{
            throw new Error("invalid credentials")
         }
    }catch(err){
        console.log("error"+err)
    }
})

authRouter.post('/logout',async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("logout successfully")
})

module.exports=authRouter;
