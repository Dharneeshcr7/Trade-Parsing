import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app=express();
dotenv.config()

const port=process.env.PORT || 3000;

app.use(express.json());

app.use((err,req,res,next)=>{
    const errStatus=err.status||500;
    const errMessage=err.message||"Something went wrong"
    return res.status(errStatus).json({
        success:false,
        status:errStatus,
        message:errMessage,
        stack:err.stack,
    });
});

const connect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("db is connected successfully")
    }
    catch(error){
        throw(error)
    }

}
mongoose.connection.on('disconnected', () => console.log('disconnected'));


app.listen(port,()=>{
    connect();
    console.log("Backend started!!");
})

