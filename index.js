import express from "express";
import connectDB from "./Config/ConnectDB.js";
import studentRouter from './Routes/student.route.js'
import userRouter from './Routes/user.route.js'
import userAuth from "./Middlewares/userAuth.js";
import rateLimit from "express-rate-limit";
import cors from 'cors'
import fs from 'fs'
import path from 'path';
connectDB();

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 10,
    message: "Too many request from this IP, please try later"
});

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}));
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/uploads",express.static(path.join(import.meta.dirname,'uploads')));
app.use(limiter)

app.use('/api/users',userRouter);
app.use('/api/students',userAuth,studentRouter);

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`This Port is running on ${PORT} on this server...`);
    
})