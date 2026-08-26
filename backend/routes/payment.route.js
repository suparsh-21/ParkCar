const express = require("express");

const {
    createPaymentController,
    paymentSuccessController
} = require("../controllers/payment.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Create a Razorpay payment order
 *     description: Creates a Razorpay order for a pending booking.
 *     tags:
 *       - Payment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - payment_method
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 25
 *               payment_method:
 *                 type: string
 *                 example: RAZORPAY
 *     responses:
 *       201:
 *         description: Payment order created successfully
 *       400:
 *         description: Invalid payment request or booking cannot be paid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized to pay for this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authMiddleware,
    createPaymentController
);


/**
 * @swagger
 * /api/payment/success:
 *   post:
 *     summary: Verify successful Razorpay payment
 *     description: Verifies the Razorpay payment signature and confirms the associated booking.
 *     tags:
 *       - Payment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *               - razorpay_payment_id
 *               - razorpay_order_id
 *               - razorpay_signature
 *             properties:
 *               payment_id:
 *                 type: integer
 *                 example: 10
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_ABC123456
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_ABC123456
 *               razorpay_signature:
 *                 type: string
 *                 example: 9d4c5f8e7b6a1234567890abcdef
 *     responses:
 *       200:
 *         description: Payment successful and booking confirmed
 *       400:
 *         description: Invalid payment, expired booking, mismatched order ID, or invalid Razorpay signature
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized for this payment
 *       404:
 *         description: Payment or booking not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/success",
    authMiddleware,
    paymentSuccessController
);


module.exports = router;