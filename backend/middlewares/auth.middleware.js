const jwt=require("jsonwebtoken")

async function authMiddleware(req,res){
try{
const token=req.cookie.token
if(!token){
    return res.status(401).json({message:"Authentication Failed"})
}
const decoded=jwt.verify(token,process.env.JWT_SECRET)
req.user=decoded
next()
}

catch(error){
    console.error("Authentication Failed",error.message)
    return res.status(401).json({message:"Invalid/Expired tokens !"})
}
}

module.exports=authMiddleware