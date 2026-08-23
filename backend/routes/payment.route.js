const express=require("express")

const{createPaymentController, paymentSuccessController}=require("../controllers/payment.controller")

const authMiddleware=require("../middlewares/auth.middleware")

const router=express.Router()

router.post("/",authMiddleware,createPaymentController)

router.post("/success",authMiddleware,paymentSuccessController)

module.exports=router