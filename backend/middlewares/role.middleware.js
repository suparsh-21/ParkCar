function roleMiddleware(requiredRole){
    return function(req,res,next){
    if(!req.user){
    return res.status(401).json({message:"Authentication Failed"})
}
if(req.user.role!==requiredRole){
    return res.status(403).json({message:"Access Denied"})
}
next()
}

}

module.exports=roleMiddleware