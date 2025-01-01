const express=require('express');
const app=express();
const connectDB=require('./config/database');

const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/requests')
const cookieParser=require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);


require('./config/database');



connectDB().then(()=>{
    console.log("db connected successfully");
    
app.listen(4080,(req,res)=>{
    console.log("server started at port no 4080")
})
}).catch((err)=>{
    console.log(err);
})


