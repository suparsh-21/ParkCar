function getBookingConfirmationEmail(booking) {

    return `
        <div style="
            font-family: Arial, sans-serif;
            background: #f3f4f6;
            padding: 40px 20px;
        ">

            <div style="
                max-width: 650px;
                margin: auto;
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            ">

                <h1 style="
                    color: #2563eb;
                    margin-bottom: 5px;
                ">
                    ParkKar
                </h1>

                <p style="
                    color: #6b7280;
                    margin-top: 0;
                ">
                    Find. Park. Go.
                </p>

                <hr style="
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 25px 0;
                ">

                <h2 style="
                    color: #111827;
                    font-size: 28px;
                ">
                    🎉 Booking Confirmed!
                </h2>

                <p style="
                    color: #374151;
                    font-size: 16px;
                    line-height: 1.7;
                ">
                    Hi ${booking.user_name},
                </p>

                <p style="
                    color: #374151;
                    font-size: 16px;
                    line-height: 1.7;
                ">
                    Your parking reservation has been successfully
                    confirmed. Your parking spot is now reserved
                    for the selected time.
                </p>

                <div style="
                    background: #eff6ff;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                ">

                    <h3 style="
                        color: #1d4ed8;
                        margin-top: 0;
                    ">
                        Parking Details
                    </h3>

                    <p style="color:#374151;">
                        <strong>Parking:</strong>
                        ${booking.parking_name}
                    </p>

                    <p style="color:#374151;">
                        <strong>Address:</strong>
                        ${booking.parking_address}
                    </p>

                    <p style="color:#374151;">
                        <strong>Start Time:</strong>
                        ${new Date(booking.start_time).toLocaleString()}
                    </p>

                    <p style="color:#374151;">
                        <strong>End Time:</strong>
                        ${new Date(booking.end_time).toLocaleString()}
                    </p>

                    <p style="color:#374151;">
                        <strong>Amount Paid:</strong>
                        ₹${booking.amount}
                    </p>

                    <p style="color:#374151;">
                        <strong>Booking ID:</strong>
                        #${booking.booking_id}
                    </p>

                </div>

                <div style="
                    background: #ecfdf5;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                ">

                    <h3 style="
                        color: #047857;
                        margin-top: 0;
                    ">
                        Your parking spot is reserved.
                    </h3>

                    <p style="
                        color: #374151;
                        line-height: 1.6;
                    ">
                        You can view your booking from your ParkKar
                        dashboard and get directions to the parking
                        location when you're ready to travel.
                    </p>

                </div>

                <a
                    href="${process.env.FRONTEND_URL}/my-bookings"
                    style="
                        display: inline-block;
                        background: #2563eb;
                        color: white;
                        padding: 14px 28px;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: bold;
                    "
                >
                    View My Booking
                </a>

                <hr style="
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    margin: 35px 0 20px;
                ">

                <p style="
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    Thank you for choosing ParkKar.
                </p>

                <p style="
                    color: #111827;
                    font-weight: bold;
                ">
                    Find. Park. Go.
                </p>

                <p style="
                    color: #9ca3af;
                    font-size: 12px;
                    margin-top: 25px;
                ">
                    This is an automated email.
                    Please do not reply to this email.
                </p>

            </div>

        </div>
    `;
}

module.exports = getBookingConfirmationEmail;