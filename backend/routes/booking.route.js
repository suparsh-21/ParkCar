const express = require("express");

const {
    createBookingController,getMyBookingsController,cancelBookingController,getParkingBookingsController
} = require("../controllers/booking.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware=require("../middlewares/role.middleware")

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createBookingController
);

router.post("/my",authMiddleware,getMyBookingsController)
router.patch("/:booking_id/cancel",authMiddleware,cancelBookingController)
router.get(
    "/parking/:parking_id",
    authMiddleware,
    roleMiddleware("OWNER"),
    getParkingBookingsController
);

module.exports = router;