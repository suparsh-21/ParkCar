const express=require('express')
const {createParkingController,getNearbyParkingController,getMyParkingsController}=require("../controllers/parking.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const roleMiddleware=require("../middlewares/role.middleware")
const router=express.Router()

router.post("/",authMiddleware,roleMiddleware("OWNER"),createParkingController)
router.get("/nearby",getNearbyParkingController)
router.get("/my",authMiddleware,roleMiddleware("OWNER"),getMyParkingsController)
module.exports=router

