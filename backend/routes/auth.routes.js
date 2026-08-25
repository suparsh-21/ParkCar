const express=require("express")
const {registerController,loginController,logoutController,forgotPasswordController,resetPasswordController}=require("../controllers/auth.controller")
const authMiddleware=require("../middlewares/auth.middleware")


const router=express.Router()

router.post("/register",registerController)
router.post("/login",loginController)
router.post(
    "/forgot-password",
    forgotPasswordController
);
router.post(
    "/reset-password",
    resetPasswordController
);
router.post("/logout",authMiddleware,logoutController)
router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Authenticated user",
        user: req.user
    });
});

module.exports=router