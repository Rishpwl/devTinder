const mongoose=require('mongoose');


const connectDB=async()=>{
await mongoose.connect('mongodb+srv://rishabhporwal2001:uJ00tnaX2rXTx5wB@cluster0.ebzt4.mongodb.net/DevTinder');

}

module.exports=connectDB;