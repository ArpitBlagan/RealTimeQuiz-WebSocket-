const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const zod=require('zod');
export const routerr=express.Router();
const {qDB,uDB}=require('../schemas/userQuesSchema');
const {v4: uuidv4,}=require('uuid');
const {validToken}=require('../middleware/validateToken');
interface dd{
    title:string,
    options:string[],
    rightAns:string
}
const ff=zod.object({
    title:zod.string(),
    options:zod.array(zod.string()),
    rightAnd:zod.string()
});
routerr.route("/login").post(async(req:any,res:any)=>{
    const {email,password}=req.body;
    const data=await uDB.findOne({email});
    if(!data||!bcrypt.compare(data.password,password)){
       return res.state(403).json({message:"not valid email&password"})   
    }console.log("hitted");
    const token=jwt.sign({
        user:{
            email:email,
            id:data._id
        }
    },process.env.ACCESS_TOKEN);console.log(token);
    res.cookie("jwt",token,{
        secure: true,
        sameSite:'none'
    })
    res.status(200).json({message:"Logged IN"});
});
routerr.route("/register").post(async(req:any,res:any)=>{
    const {email,password}=req.body;
    const data=await uDB.findOne({email},{email:1});
    console.log("regsiter route hitted");
    if(data){
        return res.status(202).json({message:"email already registered"});
    }
    const pass=await bcrypt.hash(password,12);
    console.log(email,password,pass);
    const user=await uDB.create({email,password:pass});
    if(user&&pass){
        const token=jwt.sign({
            user:{
                email:email,
                id:user._id
            }
        },process.env.ACCESS_TOKEN);
        res.cookie("jwt",token,{
            httpOnly:true,
            secure: true,
            sameSite:'none'
        });
        console.log("users",user);
        return res.status(200).json({message:"Logged IN"});
    }
    res.status(411).json({message:"something went wrong"});
});
routerr.route("/logout").get(async(req:any,res:any)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        secure: true,
        sameSite:'none'
    });
    res.status(202).json({message:"done"});
})
routerr.use(validToken);
routerr.route("/quizs").get(async(req:any,res:any)=>{
    const user_id=req.user.id;
    const data=await qDB.find({user_id},{unique_id:1,title:1});
    res.status(202).json(data);   
});
routerr.route("/loggedIn").get(async(req:any,res:any)=>{
    res.status(200).json({message:"yes"});
}) ; 
routerr.route("/addQuiz").post(async(req:any,res:any)=>{
    //Access the data from req and validate it using zod than store them db. 
    // const val=ff.parse(req.body);
    // if(!val){
    //     return res.status(411).json({message:"Please enter valid questions"});
    // } 
    const {questions}=req.body;
    const unique_id=uuidv4().slice(0,8);
    const user_id=req.user.id;
    const data=await qDB.create({user_id,unique_id,questions});
    console.log(data);
    res.status(202).json({message:"created"});
});