const express=require("express")
const authRoutes=require("./routes/auth.routes")
const cookieParser=require("cookie-parser")
const app=express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.get("/",(req,res)=>{
res.json({message:"System is running"})
})

module.exports=app