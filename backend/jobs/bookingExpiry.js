const pool = require("../config/db");

async function expirePendingBookings() {
    try {
        const result = await pool.query(
            `UPDATE bookings
             SET status = 'EXPIRED'
             WHERE status = 'PENDING'
             AND payment_deadline < CURRENT_TIMESTAMP
             RETURNING id`
        );

        if (result.rows.length > 0) {
            console.log(
                `${result.rows.length} pending booking(s) expired`
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