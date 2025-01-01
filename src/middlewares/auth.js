const jwt=require('jsonwebtoken')
const User=require('../models/user')

const userAuth=async(req,res,next)=>{

    try{

        const cookies=req.cookies;
         const {token}=cookies;
         if(!token){
            throw new Error("token not found")
         }

        const decodedMessage=await jwt.verify(token,"DEV@Tinder");
        const {_id}=decodedMessage;
    
    
        const user=await User.findById(_id);
        if(!user){
            throw new Error("user not found")
        }
        req.user=user;
        next()

    }catch(err){
        console.log(err);
    }
    

}

module.exports={userAuth};