const bcrypt=require('bcrypt')
const pool=require('../config/db')
const generateToken = require('../utils/generateToken')

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
         VALUES($1,$2,$3,$4) RETURNING id,name,email,role ,created_at`,[name,email,hashedPassword,role || "DRIVER"]
    )
    return res.status(201).json({message:"User registered successfully",user:result.rows[0]})
}
catch(error){
    console.error("Registration Error !",error.message)
    return res.status(500).json({message:"Internal Server Error !!"})
}
}

async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required before you can login!"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }


        const token = generateToken(user);
        res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:7*24*60*60*1000})

        return res.status(200).json({
            message: "Login Successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Login error", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function logoutController(req,res){
try{
    res.clearCookie("token",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict"})
    return res.status(200).json({message:"Logout Successfull"})
}
catch(error){
    console.error("Logout Error",error.message)
    return res.json(500).json({message:"Internal Server Error !"})

}

}








module.exports={registerController,loginController,logoutController}