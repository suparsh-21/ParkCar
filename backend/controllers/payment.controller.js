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

async function paymentSuccessController(req, res) {
    try {
        const { payment_id, transaction_id } = req.body;

        if (!payment_id || !transaction_id) {
            return res.status(400).json({
                message: "Payment ID and transaction ID are required"
            });
        }

        // Get payment
        const paymentResult = await pool.query(
            `SELECT * FROM payments WHERE id = $1`,
            [payment_id]
        );

        if (paymentResult.rows.length === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        const payment = paymentResult.rows[0];

        // Get booking
        const bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [payment.booking_id]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = bookingResult.rows[0];

        // Make sure booking belongs to logged-in user
        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You are not authorized for this payment"
            });
        }

        // Update payment
        const updatedPayment = await pool.query(
            `UPDATE payments
             SET status = 'SUCCESS',
                 transaction_id = $1
             WHERE id = $2
             RETURNING *`,
            [transaction_id, payment_id]
        );

        // Update booking
        const updatedBooking = await pool.query(
            `UPDATE bookings
             SET status = 'CONFIRMED'
             WHERE id = $1
             RETURNING *`,
            [payment.booking_id]
        );

        // Reduce available slot
        await pool.query(
            `UPDATE parking_lots
             SET available_slots = available_slots - 1
             WHERE id = $1
             AND available_slots > 0`,
            [booking.parking_lot_id]
        );

        return res.status(200).json({
            message: "Payment successful and booking confirmed",
            payment: updatedPayment.rows[0],
            booking: updatedBooking.rows[0]
        });

    } catch (error) {
        console.error("Payment Success Error!", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}




module.exports={createPaymentController,paymentSuccessController}