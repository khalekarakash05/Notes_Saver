const jwt=require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel")

exports.auth= async(req,res, next)=>{
    try {
        //extracting token from req ki body
        // console.log("body",req.body.token)
        // console.log("cookie",req.cookies.token)
        console.log("header",req.header("Authorization"))
        
        const token= req.header("Authorization").replace("Bearer ", "");
        console.log("token",token);

        //now check is token empty or not
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token fetched in req body is empty"
            })
        }

        //now verify the token
        try {
            const decode=jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded token", decode);
            req.user=await User.findById(decode.id).select("-password");
            console.log("user",req.user);
            if (!req.user) {
                return res.status(404).json({
                  success: false,
                  message: "User not found",
                });
              }

            next();
        } catch (error) {
            console.error(error);
            return res.status(402).json({
                success:false,
                message:"error occured in verifying token"
            })
        }

        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error occured while auth middleware"
        })
    }
};
