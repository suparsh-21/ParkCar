const pool = require("../config/db");

async function expirePendingBookings() {
    try {

        // Expire unpaid bookings
        const expiredResult = await pool.query(
            `UPDATE bookings
             SET status = 'EXPIRED'
             WHERE status = 'PENDING'
             AND payment_deadline < CURRENT_TIMESTAMP
             RETURNING id`
        );

        if (expiredResult.rows.length > 0) {
            console.log(
                `${expiredResult.rows.length} pending booking(s) expired`
            );
        }


        // Complete finished bookings
        const completedResult = await pool.query(
            `UPDATE bookings
             SET status = 'COMPLETED'
             WHERE status = 'CONFIRMED'
             AND end_time <= CURRENT_TIMESTAMP
             RETURNING id`
        );

        if (completedResult.rows.length > 0) {
            console.log(
                `${completedResult.rows.length} booking(s) completed`
            );
        }

    } catch (error) {

        console.error(
            "Booking Expiry Error!",
            error.message
        );

    }
}

module.exports = expirePendingBookings;