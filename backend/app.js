const express=require("express")
const cookieParser=require("cookie-parser")
const authRoutes=require("./routes/auth.routes")
const parkingRoutes=require("./routes/parking.route")
const bookingRoutes=require("./routes/booking.route")
const paymentRoutes=require('./routes/payment.route')
const app=express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/parking",parkingRoutes)
app.use("/api/booking",bookingRoutes)
app.use("/api/payment",paymentRoutes)

app.get("/",(req,res)=>{
res.json({message:"System is running"})
})

module.exports=app