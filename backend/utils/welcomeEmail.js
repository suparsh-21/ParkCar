function getWelcomeEmail(user){

    const roleContent =
        user.role === "OWNER"
            ? `
                <h3 style="color:#111827;">
                    Start managing your parking space
                </h3>

                <p>
                    As a parking owner, ParkKar gives you the tools
                    to create and manage your parking locations,
                    manage available slots, control your parking
                    availability and keep track of your bookings.
                </p>

                <ul style="line-height:1.8;">
                    <li>Create and manage parking locations</li>
                    <li>Set your parking price per hour</li>
                    <li>Manage available parking slots</li>
                    <li>Open or close your parking location</li>
                    <li>View bookings made by drivers</li>
                </ul>
            `
            : `
                <h3 style="color:#111827;">
                    Everything you need for easier parking
                </h3>

                <p>
                    With ParkKar, finding and reserving parking
                    becomes simple and convenient.
                </p>

                <ul style="line-height:1.8;">
                    <li>Find nearby parking locations</li>
                    <li>Compare parking availability and prices</li>
                    <li>Choose your preferred parking time</li>
                    <li>Reserve your parking spot</li>
                    <li>Pay securely through Razorpay</li>
                    <li>Get directions through Google Maps</li>
                    <li>Manage your bookings from your dashboard</li>
                </ul>
            `;

    return `
        <div style="
            font-family:Arial,sans-serif;
            background:#f3f4f6;
            padding:40px 20px;
        ">

            <div style="
                max-width:650px;
                margin:auto;
                background:white;
                border-radius:16px;
                padding:40px;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
            ">

                <h1 style="
                    color:#2563eb;
                    margin-bottom:10px;
                ">
                    ParkKar
                </h1>

                <p style="
                    color:#6b7280;
                    margin-top:0;
                ">
                    Find. Park. Go.
                </p>

                <hr style="
                    border:none;
                    border-top:1px solid #e5e7eb;
                    margin:25px 0;
                ">

                <h2 style="
                    color:#111827;
                    font-size:28px;
                ">
                    Welcome to ParkKar, ${user.name}! 🚗
                </h2>

                <p style="
                    color:#374151;
                    font-size:16px;
                    line-height:1.7;
                ">
                    We're excited to have you with us.
                    Your ParkKar account has been successfully
                    created and you're now ready to make parking
                    easier and more convenient.
                </p>

                ${roleContent}

                <div style="
                    background:#eff6ff;
                    border-radius:12px;
                    padding:20px;
                    margin:30px 0;
                ">

                    <h3 style="
                        color:#1d4ed8;
                        margin-top:0;
                    ">
                        You're all set!
                    </h3>

                    <p style="
                        color:#374151;
                        line-height:1.6;
                    ">
                        Your account is ready to use.
                        Start exploring ParkKar and enjoy a
                        simpler parking experience.
                    </p>

                </div>

                <a
                    href="${process.env.FRONTEND_URL}"
                    style="
                        display:inline-block;
                        background:#2563eb;
                        color:white;
                        padding:14px 28px;
                        border-radius:8px;
                        text-decoration:none;
                        font-weight:bold;
                    "
                >
                    Open ParkKar
                </a>

                <hr style="
                    border:none;
                    border-top:1px solid #e5e7eb;
                    margin:35px 0 20px;
                ">

                <p style="
                    color:#6b7280;
                    font-size:14px;
                    line-height:1.6;
                ">
                    We're glad to have you on ParkKar.
                </p>

                <p style="
                    color:#111827;
                    font-weight:bold;
                ">
                    Find. Park. Go.
                </p>

                <p style="
                    color:#9ca3af;
                    font-size:12px;
                    margin-top:25px;
                ">
                    This is an automated email.
                    Please do not reply to this email.
                </p>

            </div>

        </div>
    `;
}

module.exports = getWelcomeEmail;