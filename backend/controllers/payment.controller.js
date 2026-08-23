const pool = require('../config/db')


async function createPaymentController(req, res) {
    try {

        const { booking_id, payment_method } = req.body

        if (!booking_id || !payment_method) {
            return res.status(400).json({
                message: "Booking ID and payment method is required"
            })
        }

        const bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [booking_id]
        )

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            })
        }

        const booking = bookingResult.rows[0]

        // Check booking owner
        if (Number(booking.user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                message: "You are not authorized to pay for this booking, Sorry !"
            })
        }

        // Check booking status
        if (booking.status !== "PENDING") {
            return res.status(400).json({
                message: "This booking cannot be paid for"
            })
        }

        // Check payment deadline
        if (
            booking.payment_deadline &&
            new Date(booking.payment_deadline) < new Date()
        ) {

            await pool.query(
                `UPDATE bookings
                 SET status = 'EXPIRED'
                 WHERE id = $1`,
                [booking.id]
            )

            return res.status(400).json({
                message: "Payment deadline has expired"
            })
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
        )

        return res.status(201).json({
            message: "Payment initiated Successfully !",
            payment: result.rows[0]
        })

    } catch (error) {

        console.error(
            "Payment creation Error !",
            error.message
        )

        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}


async function paymentSuccessController(req, res) {

    const client = await pool.connect()

    try {

        const {
            payment_id,
            transaction_id
        } = req.body

        if (!payment_id || !transaction_id) {
            return res.status(400).json({
                message: "Payment ID and transaction ID are required"
            })
        }

        await client.query("BEGIN")


        // 1. Get payment
        const paymentResult = await client.query(
            `SELECT *
             FROM payments
             WHERE id = $1
             FOR UPDATE`,
            [payment_id]
        )

        if (paymentResult.rows.length === 0) {

            await client.query("ROLLBACK")

            return res.status(404).json({
                message: "Payment not found"
            })
        }

        const payment = paymentResult.rows[0]


        // 2. Get booking
        const bookingResult = await client.query(
            `SELECT *
             FROM bookings
             WHERE id = $1
             FOR UPDATE`,
            [payment.booking_id]
        )

        if (bookingResult.rows.length === 0) {

            await client.query("ROLLBACK")

            return res.status(404).json({
                message: "Booking not found"
            })
        }

        const booking = bookingResult.rows[0]


        // 3. Check ownership
        if (
            Number(booking.user_id) !==
            Number(req.user.id)
        ) {

            await client.query("ROLLBACK")

            return res.status(403).json({
                message: "You are not authorized for this payment"
            })
        }


        // 4. Check booking status
        if (booking.status !== "PENDING") {

            await client.query("ROLLBACK")

            return res.status(400).json({
                message: "This booking is not pending"
            })
        }


        // 5. Check payment deadline
        if (
            booking.payment_deadline &&
            new Date(booking.payment_deadline) < new Date()
        ) {

            await client.query(
                `UPDATE bookings
                 SET status = 'EXPIRED'
                 WHERE id = $1`,
                [booking.id]
            )

            await client.query("COMMIT")

            return res.status(400).json({
                message: "Payment deadline has expired"
            })
        }


        // 6. Reserve one parking slot safely
        const slotResult = await client.query(
            `UPDATE parking_lots
             SET available_slots = available_slots - 1
             WHERE id = $1
             AND available_slots > 0
             RETURNING *`,
            [booking.parking_lot_id]
        )

        if (slotResult.rows.length === 0) {

            await client.query("ROLLBACK")

            return res.status(400).json({
                message: "No parking slot available"
            })
        }


        // 7. Update payment
        const updatedPayment = await client.query(
            `UPDATE payments
             SET status = 'SUCCESS',
                 transaction_id = $1
             WHERE id = $2
             RETURNING *`,
            [
                transaction_id,
                payment_id
            ]
        )


        // 8. Confirm booking
        const updatedBooking = await client.query(
            `UPDATE bookings
             SET status = 'CONFIRMED'
             WHERE id = $1
             RETURNING *`,
            [payment.booking_id]
        )


        // 9. Everything succeeded
        await client.query("COMMIT")


        return res.status(200).json({
            message: "Payment successful and booking confirmed",

            payment: updatedPayment.rows[0],

            booking: updatedBooking.rows[0],

            parking: slotResult.rows[0]
        })

    } catch (error) {

        await client.query("ROLLBACK")

        console.error(
            "Payment Success Error!",
            error.message
        )

        return res.status(500).json({
            message: "Internal Server Error"
        })

    } finally {

        client.release()

    }
}


module.exports = {
    createPaymentController,
    paymentSuccessController
}