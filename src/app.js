const express=require('express');
const app=express();
const connectDB=require('./config/database');

const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/requests')
const cookieParser=require('cookie-parser');
const userRouter = require('./routes/user');
const cors=require('cors');
const paymentRouter = require('./routes/payment');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
app.use('/',paymentRouter);


require('./config/database');



connectDB().then(()=>{
    console.log("db connected successfully");
    
app.listen(process.env.PORT,(req,res)=>{
    console.log("server started at port no 4080")
})
}).catch((err)=>{
    console.log(err);
})


