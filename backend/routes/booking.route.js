const express = require("express");

const {
    createBookingController,
    getMyBookingsController,
    cancelBookingController,
    getParkingBookingsController
} = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const router = express.Router();


/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a parking booking
 *     description: Creates a pending booking for an available parking slot.
 *     tags:
 *       - Booking
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parking_lot_id
 *               - start_time
 *               - end_time
 *             properties:
 *               parking_lot_id:
 *                 type: integer
 *                 example: 1
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-27T18:00:00Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-27T20:00:00Z
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking details or no slot available
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parking lot not found
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authMiddleware,
    createBookingController
);


/**
 * @swagger
 * /api/booking/my:
 *   post:
 *     summary: Get current user's bookings
 *     description: Returns all bookings belonging to the authenticated user.
 *     tags:
 *       - Booking
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
    "/my",
    authMiddleware,
    getMyBookingsController
);


/**
 * @swagger
 * /api/booking/{booking_id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     description: Cancels an upcoming confirmed booking belonging to the authenticated user.
 *     tags:
 *       - Booking
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 25
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized to cancel this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:booking_id/cancel",
    authMiddleware,
    cancelBookingController
);


/**
 * @swagger
 * /api/booking/parking/{parking_id}:
 *   get:
 *     summary: Get bookings for a parking lot
 *     description: Returns bookings for a parking lot owned by the authenticated owner.
 *     tags:
 *       - Booking
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: parking_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Parking bookings fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not authorized to view these bookings
 *       404:
 *         description: Parking lot not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/parking/:parking_id",
    authMiddleware,
    roleMiddleware("OWNER"),
    getParkingBookingsController
);


module.exports = router;