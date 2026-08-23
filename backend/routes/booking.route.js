const express = require("express");

const {
    createBookingController
} = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createBookingController
);

module.exports = router;