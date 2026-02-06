import express from "express";
import userModel from '../Models/userModel.js'
import bcrypt, { compare } from 'bcrypt'
import jwt   from 'jsonwebtoken'
import dotEnv from 'dotenv'

dotEnv.config();
const router = express.Router();

//REGISTER
router.post('/register', async (req,res)=>{
    try {
        const {userName, userEmail, userPassword} = req.body;
        console.log("reqbody",req.body);
        
        let existUser = await userModel.findOne({$or: [{userName}, {userEmail}] });
        if(existUser) return res.status(404).json({message: "Username and email already exists!!"});
        
        let newPassword = await bcrypt.hash(userPassword,10);
        const user = new userModel({userName, userEmail, userPassword: newPassword});
        const userSave = await user.save()
        res.json(userSave);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

//LOGIN

router.post('/login', async (req,res)=>{
    try {
    const {userEmail, userPassword} = req.body;
    const user = await userModel.findOne({userEmail});
    if(!user) return res.status(404).json({message:"Student Not found!!"});

    const password = await bcrypt.compare(userPassword, user.userPassword)
    if(!password) res.status(404).json({message: "Password not matched!"});

    const jwtToken = jwt.sign(
        {_id: user._id, userName: user.userName},
        process.env.JWT_SECRET,
        {expiresIn:'1h'}
    )
    res.json({jwtToken});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//LOGOUT
router.get('/logout', async(req,res)=>{
    res.json({message: "Logout Successfully...!"})
});

export default router;