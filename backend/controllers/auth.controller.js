const bcrypt = require("bcrypt");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail=require("../utils/sendEmail")
const getWelcomeEmail=require("../utils/welcomeEmail")



async function registerController(req,res){
    try{
        const {name,email,password,role}=req.body

        if(!name|| !email || !password){
        return res.status(400).json({message:"All fields are required"})
            }

        const existingUser=await pool.query("SELECT id FROM users WHERE email=$1",[email])
        if(existingUser.rows.length>0){
            return res.status(400).json({message:"User already exists"})        
        }

    const hashedPassword=await bcrypt.hash(password,10)
    const result=await pool.query (
        `INSERT INTO users(name,email,password,role)
         VALUES($1,$2,$3,$4) RETURNING id,name,email,role ,created_at`,[name,email,hashedPassword,role || "DRIVER"]
    )
const newUser = result.rows[0];

try {
    const welcomeEmailHTML = getWelcomeEmail(newUser);

    await sendEmail(
        newUser.email,
        "Welcome to ParkKar — Find. Park. Go. 🚗",
        welcomeEmailHTML
    );

} catch (emailError) {
    console.error(
        "Welcome Email Error!",
        emailError.message
    );
}
    return res.status(201).json({message:"User registered successfully",user:newUser})
}
catch(error){
    console.error("Registration Error !",error.message)
    return res.status(500).json({message:"Internal Server Error !!"})
}
}

async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required before you can login!"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }


        const token = generateToken(user);
        res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",maxAge:7*24*60*60*1000})

        return res.status(200).json({
            message: "Login Successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Login error", error.message);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function logoutController(req,res){
try{
    res.clearCookie("token",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict"})
    return res.status(200).json({message:"Logout Successfull"})
}
catch(error){
    console.error("Logout Error",error.message)
    return res.status(500).json({message:"Internal Server Error !"})

}

}

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Find user
        const userResult = await pool.query(
            `SELECT id, email, name
             FROM users
             WHERE email=$1`,
            [email]
        );

        /*
         * Always return the same message whether the
         * email exists or not.
         *
         * This prevents users from discovering
         * which emails are registered.
         */
        if (userResult.rows.length === 0) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }

        const user = userResult.rows[0];

        // Delete any previous reset tokens for this user
        await pool.query(
            `DELETE FROM password_reset_tokens
             WHERE user_id=$1`,
            [user.id]
        );

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing it
        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires in 15 minutes
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        // Store hashed token
        await pool.query(
            `INSERT INTO password_reset_tokens
            (user_id, token_hash, expires_at)
            VALUES($1,$2,$3)`,
            [
                user.id,
                tokenHash,
                expiresAt
            ]
        );

        // Create frontend reset URL
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Email content
        const emailHTML = `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                border: 1px solid #ddd;
                border-radius: 12px;
            ">

                <h1 style="color:#2563eb;">
                    ParkKar
                </h1>

                <h2>
                    Reset your password
                </h2>

                <p>
                    Hello ${user.name},
                </p>

                <p>
                    We received a request to reset your ParkKar password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:12px 24px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                    "
                >
                    Reset Password
                </a>

                <p style="margin-top:25px;">
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <p>
                    — ParkKar Team
                </p>

            </div>
        `;

        // Send email
        await sendEmail(
            user.email,
            "Reset your ParkKar password",
            emailHTML
        );

        return res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {

        console.error(
            "Forgot Password Error!",
            error.message
        );

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
async function resetPasswordController(req, res) {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash the token received from the reset link
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find valid reset token
        const tokenResult = await pool.query(
            `SELECT *
             FROM password_reset_tokens
             WHERE token_hash=$1
             AND expires_at>CURRENT_TIMESTAMP`,
            [tokenHash]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid or expired password reset link"
            });
        }

        const resetToken = tokenResult.rows[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        await pool.query(
            `UPDATE users
             SET password=$1
             WHERE id=$2`,
            [
                hashedPassword,
                resetToken.user_id
            ]
        );

        // Delete the reset token so it cannot be used again
        await pool.query(
            `DELETE FROM password_reset_tokens
             WHERE id=$1`,
            [resetToken.id]
        );

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {

        console.error(
            "Reset Password Error!",
            error.message
        );

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports={registerController,loginController,logoutController,forgotPasswordController,resetPasswordController}