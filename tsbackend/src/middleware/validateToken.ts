const jwt=require('jsonwebtoken');
exports.validToken=async(req:any,res:any,next:any)=>{
    const token=req.cookies.jwt;
    jwt.verify(token,process.env.ACCESS_TOKEN,(err:any,decode:any)=>{
        if(err){
            console.log("error in middlware");
            return res.status(403).json({message:'Authorization error'});
        }else{req.user=decode.user; next();}
    });
}