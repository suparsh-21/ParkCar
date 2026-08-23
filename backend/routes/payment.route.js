const express=require("express")

const{createPaymentController}=require("../controllers/payment.controller")

const authMiddleware=require("../middlewares/auth.middleware")

const router=express.Router()

router.post("/",authMiddleware,createPaymentController)

module.exports=router