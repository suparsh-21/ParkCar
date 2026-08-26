const express = require("express");

const {
    registerController,
    loginController,
    logoutController,
    forgotPasswordController,
    resetPasswordController
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new ParkKar user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Suparsh Pandita
 *               email:
 *                 type: string
 *                 format: email
 *                 example: suparsh@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - DRIVER
 *                   - OWNER
 *                 example: DRIVER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request or user already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerController);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and creates an HTTP-only JWT cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: suparsh@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginController);


/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's registered email address.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: suparsh@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 */
router.post(
    "/forgot-password",
    forgotPasswordController
);


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets a user's password using a valid password reset token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: 9f8a7b6c5d4e3f2a1b0c
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */
router.post(
    "/reset-password",
    resetPasswordController
);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears the authenticated user's JWT cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/logout",
    authMiddleware,
    logoutController
);


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the currently authenticated user's information.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/me",
    authMiddleware,
    (req, res) => {

        return res.status(200).json({
            message: "Authenticated user",
            user: req.user
        });

    }
);


module.exports = router;