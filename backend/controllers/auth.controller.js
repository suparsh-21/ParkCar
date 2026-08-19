const bcrypt=require('bcrypt')
const pool=require('../config/db')

async function registerController(req,res){
    try{
        const {name,email,password,role}=req.body

        if(!name|| !email || !password){
        return res.status(400).json({message:"All fields are required"})
            }

        const existingUser=await pool.query("SELECT id FROM users WHERE email=$1",[email])
        if(existingUser.rows.length>0){
            return res.status(400).json({message:"User already exists"})        
        }

    const hashedPassword=await bcrypt.hash(password,10)
    const result=await pool.query (
        `INSERT INTO users(name,email,password,role)
         VALUES($1,$2,$3,$4) RETURNING id,name,email,password,role ,created_at`,[name,email,hashedPassword,role || "DRIVER"]
    )
    return res.status(201).json({message:"User registered successfully",user:result.rows[0]})
}
catch(error){
    console.error("Registration Error !",error.message)
    return res.status(500).json({message:"Internal Server Error !!"})
}
}












module.exports={registerController}