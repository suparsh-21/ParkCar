require ("dotenv").config()
const app=require("./app")
const pool=require("./config/db")
const PORT=5000

pool.connect().then((client)=>{
    console.log("PostgreSQl connected successfully")
    client.release()
    app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})
})
.catch((error)=>{
    console.error("PostgreSQL connection failed",error.message)

})

