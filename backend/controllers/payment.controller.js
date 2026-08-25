const pool = require('../config/db')
const razorpay = require('../utils/razorpay')
const crypto = require('crypto')


async function createPaymentController(req,res){
    try{

        const{booking_id,payment_method}=req.body

        if(!booking_id || !payment_method){
            return res.status(400).json({
                message:"Booking ID and payment method is required"
            })
        }

        // Get booking
        const bookingResult=await pool.query(
            `SELECT * FROM bookings
             WHERE id=$1`,
            [booking_id]
        )

        if(bookingResult.rows.length===0){
            return res.status(404).json({
                message:"Booking not found"
            })
        }

        const booking=bookingResult.rows[0]

        // Check booking owner
        if(Number(booking.user_id)!==Number(req.user.id)){
            return res.status(403).json({
                message:"You are not authorized to pay for this booking"
            })
        }

        // Check booking status
        if(booking.status!=="PENDING"){
            return res.status(400).json({
                message:"This booking cannot be paid for"
            })
        }

        // Check payment deadline
        if(
            booking.payment_deadline &&
            new Date(booking.payment_deadline)<new Date()
        ){

            await pool.query(
                `UPDATE bookings
                 SET status='EXPIRED'
                 WHERE id=$1`,
                [booking.id]
            )

            return res.status(400).json({
                message:"Payment deadline has expired"
            })
        }

        // Check if payment already exists
        const existingPayment=await pool.query(
            `SELECT * FROM payments
             WHERE booking_id=$1`,
            [booking_id]
        )

        if(existingPayment.rows.length>0){
            return res.status(400).json({
                message:"Payment has already been initiated for this booking"
            })
        }

        // Create Razorpay order
        const options={
            amount:Math.round(Number(booking.amount)*100),
            currency:"INR",
            receipt:`booking_${booking.id}`
        }

        const order=await razorpay.orders.create(options)

        // Create payment record
        const result=await pool.query(
            `INSERT INTO payments
            (
                booking_id,
                amount,
                payment_method,
                razorpay_order_id
            )
            VALUES($1,$2,$3,$4)
            RETURNING *`,
            [
                booking_id,
                booking.amount,
                payment_method,
                order.id
            ]
        )

        return res.status(201).json({
            message:"Payment order created successfully",
            payment:result.rows[0],
            razorpay:{
                order_id:order.id,
                amount:order.amount,
                currency:order.currency,
                key_id:process.env.RAZORPAY_KEY_ID
            }
        })

    }
    catch(error){

        console.error(
            "Payment Creation Error!",
            error.message
        )

        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


async function paymentSuccessController(req,res){

    const client=await pool.connect()

    try{

        const{
            payment_id,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        }=req.body

        if(
            !payment_id ||
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ){
            return res.status(400).json({
                message:"Payment ID, Razorpay payment ID, order ID and signature are required"
            })
        }

        await client.query("BEGIN")


        // 1. Get payment
        const paymentResult=await client.query(
            `SELECT *
             FROM payments
             WHERE id=$1
             FOR UPDATE`,
            [payment_id]
        )

        if(paymentResult.rows.length===0){

            await client.query("ROLLBACK")

            return res.status(404).json({
                message:"Payment not found"
            })
        }

        const payment=paymentResult.rows[0]


        // 2. Check payment status
        if(payment.status!=="PENDING"){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"This payment has already been processed"
            })
        }


        // 3. Get booking
        const bookingResult=await client.query(
            `SELECT *
             FROM bookings
             WHERE id=$1
             FOR UPDATE`,
            [payment.booking_id]
        )

        if(bookingResult.rows.length===0){

            await client.query("ROLLBACK")

            return res.status(404).json({
                message:"Booking not found"
            })
        }

        const booking=bookingResult.rows[0]


        // 4. Check booking owner
        if(
            Number(booking.user_id)!==
            Number(req.user.id)
        ){

            await client.query("ROLLBACK")

            return res.status(403).json({
                message:"You are not authorized for this payment"
            })
        }


        // 5. Check booking status
        if(booking.status!=="PENDING"){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"This booking is not pending"
            })
        }


        // 6. Check payment deadline
        if(
            booking.payment_deadline &&
            new Date(booking.payment_deadline)<new Date()
        ){

            await client.query(
                `UPDATE bookings
                 SET status='EXPIRED'
                 WHERE id=$1`,
                [booking.id]
            )

            await client.query("COMMIT")

            return res.status(400).json({
                message:"Payment deadline has expired"
            })
        }


        // 7. Check Razorpay order ID
        if(payment.razorpay_order_id!==razorpay_order_id){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"Razorpay order ID does not match"
            })
        }


        // 8. Generate Razorpay signature
        const generatedSignature=crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                payment.razorpay_order_id +
                "|" +
                razorpay_payment_id
            )
            .digest("hex")


        // 9. Compare signatures safely
        const generatedBuffer=Buffer.from(
            generatedSignature,
            "hex"
        )

        const receivedBuffer=Buffer.from(
            razorpay_signature,
            "hex"
        )

        if(
            generatedBuffer.length!==receivedBuffer.length ||
            !crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            )
        ){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"Invalid Razorpay payment signature"
            })
        }


        // 10. Reserve parking slot
        const slotResult=await client.query(
            `UPDATE parking_lots
             SET available_slots=available_slots-1
             WHERE id=$1
             AND available_slots>0
             RETURNING *`,
            [booking.parking_lot_id]
        )

        if(slotResult.rows.length===0){

            await client.query("ROLLBACK")

            return res.status(400).json({
                message:"No parking slot available"
            })
        }


        // 11. Update payment
        const updatedPayment=await client.query(
            `UPDATE payments
             SET status='SUCCESS',
                 razorpay_payment_id=$1,
                 razorpay_signature=$2
             WHERE id=$3
             RETURNING *`,
            [
                razorpay_payment_id,
                razorpay_signature,
                payment_id
            ]
        )


        // 12. Confirm booking
        const updatedBooking=await client.query(
            `UPDATE bookings
             SET status='CONFIRMED'
             WHERE id=$1
             RETURNING *`,
            [payment.booking_id]
        )


        // 13. Everything succeeded
        await client.query("COMMIT")


        return res.status(200).json({

            message:"Payment successful and booking confirmed",

            payment:updatedPayment.rows[0],

            booking:updatedBooking.rows[0],

            parking:slotResult.rows[0]

        })

    }
    catch(error){

        await client.query("ROLLBACK")

        console.error(
            "Payment Success Error!",
            error.message
        )

        return res.status(500).json({
            message:"Internal Server Error"
        })

    }
    finally{

        client.release()

    }
}


module.exports={
    createPaymentController,
    paymentSuccessController
}