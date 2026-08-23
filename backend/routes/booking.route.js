const express = require("express");

const {
    createBookingController,getMyBookingsController
} = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createBookingController
);

router.post("/my",authMiddleware,getMyBookingsController)

module.exports = router;