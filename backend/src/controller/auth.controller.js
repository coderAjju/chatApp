import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { tokenGenerator } from '../lib/tokenGenerator.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
        const {fullname,email,password} = req.body;
        try {
            if(password.length < 8){
                return res.status(400).json({error:"Password should be at least 6 characters"});
            }
            const user = await User.findOne({email});
            if(user){
                return res.status(400).json({error:"User already exists"});
            }

            let salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(password,salt);
            let profilePic = `https://avatar.iran.liara.run/username?username=${fullname}`

            const newUser = await User({
                fullname,
                email,
                password:hashPassword,
                profilePic
            })

            if(newUser){
                //generate token
                tokenGenerator(newUser._id,res);
                await newUser.save();

            }
            res.status(201).json({message:"User created successfully",user:newUser});
        } catch (error) {
            console.log("error ouccured in signup controller: ",error.message);
            res.status(500).json({error:"Internal server error"});
        }
};


export const login = async (req,res) => {
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({error:"Please provide email and password"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }

        tokenGenerator(user._id,res);
        res.status(200).json({message:"User logged in successfully",user});
    } catch (error) {
        console.log("error occured in login controller: ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logout successful"});
    } catch (error) {
        console.log("error in logout controller: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export const updateProfile = async (req,res)=>{
try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
        return res.status(400).json({error:"Please provide profile picture"});
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:cloudinaryResponse.secure_url},{new:true})

    res.status(201).json(updatedUser);
} catch (error) {
    console.log("error occured in update profile controller: ",error.message);
    res.status(500).json({error:"Internal server error"});
}
}

export const checkAuth = async (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error occured in check auth controller: ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}