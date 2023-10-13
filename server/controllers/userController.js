import User from "../models/userModel.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const createToken=(_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'} );
}

//signin user
const signinUser=async(req, res)=>{
    const {email, password}=req.body;
    try{
        const user=await User.login(email, password);
        const token=createToken(user._id);
        console.log(email, token);
        res.status(200).json({email, token});
    } catch(error){
        res.status(400).json({error:error.message});
    }
    
}

//signup user
const signupUser=async(req, res)=>{
    const {email, password}=req.body;
    try{
        const user=await User.signup(email, password);
        const token=createToken(user._id);
        console.log(email, token);
        res.status(200).json({email, token});
    } catch(error){
        res.status(400).json({error:error.message});
    }
    
}

export {signinUser, signupUser};