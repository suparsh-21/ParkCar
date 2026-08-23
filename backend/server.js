require ("dotenv").config()
const app=require("./app")
const pool=require("./config/db")
const expirePendingBookings = require("./jobs/bookingExpiry")
const PORT=5000

pool.connect().then((client)=>{
    console.log("PostgreSQl connected successfully")
    client.release()
    app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
  setInterval(() => {
        expirePendingBookings()
    }, 60 * 1000) 
})
.catch((error)=>{
    console.error("PostgreSQL connection failed",error.message)

})

