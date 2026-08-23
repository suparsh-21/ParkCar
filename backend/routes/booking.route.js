const express = require("express");

const {
    createBookingController,getMyBookingsController,cancelBookingController
} = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createBookingController
);

router.post("/my",authMiddleware,getMyBookingsController)
router.patch("/:booking_id/cancel",authMiddleware,cancelBookingController)

module.exports = router;