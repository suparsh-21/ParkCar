const pool=require('../config/db')

async function createPaymentController(req,res){
try{
    const{booking_id,payment_method}=req.body
    if(!booking_id ||!payment_method){return res.status(400).json({message:"Booking ID and payment method is required"})}
    const bookingResult=await pool.query(`SELECT * FROM bookings where id=$1`,[booking_id])
    if(bookingResult.rows.length===0){return res.status(404).json({message:"Booking not found"})}
    const booking=bookingResult.rows[0]
    if(booking.user_id!==req.user.id){
    return res.status(403).json({message:"You are not authorized to pay for this booking, Sorry !"})
}
   if (booking.status !== "PENDING") {
            return res.status(400).json({
                message: "This booking cannot be paid for"
            });
        }

    const result = await pool.query(
            `INSERT INTO payments
            (booking_id, amount, payment_method)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                booking_id,
                booking.amount,
                payment_method
            ]
        );
    return res.status(201).json({message:"Payment initiated Successfully !",payment:result.rows[0]})
}
catch(error){
    console.error("Payment creation Error !",error.message)
    return res.status(500).json({message:"Internal Server Error !"})
}

}
module.exports={createPaymentController}