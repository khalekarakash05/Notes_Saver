const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Note = require("../models/notesModel")

exports.signUp=async(req,res)=>{
    try {
        //get data
        const {name, email, password}=req.body;

        const existingData=await User.findOne({email});

        if(existingData){
            return res.status(400).json({
                success:false,
                message:"User already exits",
            })
        }

        //secure the password
        let hashedPassword
        try {
            hashedPassword=await bcrypt.hash(password, 10);

            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"error is occured in hashing the password"
            })
        }

        //create the entry of user in the database
        const users=await User.create({
            name, email, password:hashedPassword
        });

        return res.status(200).json({
            user:users,
            success:true,
            message:"User created successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be created please try again latter"
        })
    }
};



//login
exports.logIn=async (req,res)=>{
    try {
        //fetching data
        const {email, password}=req.body;
        //check weather email or password is present or not
        if(!email || !password){
            res.status(400).json({
                success:false,
                message:"Enter the all details carefully",
            })
        }

        //finding email from database
        const user=await User.findOne({email})
        
        //checking weather user registered or not
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered",
            })
        };
        //create payload
        const payload={
            email:user.email,
            id:user._id,
        }

        if( await bcrypt.compare(password,user.password)){
            //password match
            //create jwt token
            const token=jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"20h"
            })

            //pass token in user object
            // User=User.toObject();
            // User.token=token;
            // User.password=undefined;
            const updateUser={
                ...user.toObject(),
                token:token
            };
            updateUser.password=undefined;

            //create cookie and send a response
            const options={
                expires:new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            // req.cookies.token=token;
            return res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                updateUser,
                
                message:"user logged in successfully",
            })
        }
        else{
            res.status(403).json({
                success:false,
                message:"Password does not match",
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Failure in logged in try again later",
        })
    }
}

exports.getUserProfile = async(req, res) => {
    try {
        const userr = req.user;
        console.log("userr", userr);
        if (!userr) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

        const id = userr.id;
        console.log("id", id);
        // const data = await User.find(email);
        const data = await User.findById(id);
        console.log("data", data);

        if(!data){
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const notes = await Note.find({user: id});
        console.log("notes", notes);
        if(notes){
            data.notes = notes;
        }

        return res.status(200).json({
            success: true,
            data,
            message: "User found successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User not found"
        });
    }
}
