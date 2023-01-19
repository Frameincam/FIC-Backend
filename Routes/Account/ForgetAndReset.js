import express from "express";

import { forgetPassword, verifyOTP, resetPassword } from "../../Controllers/Account/forgetAndReset.js";

const router = express.Router();

router.post("/forget-password/otp/:number", forgetPassword);
router.post("/verify/otp/:otp", verifyOTP);
router.post("/reset-password/otp/:number", resetPassword);

export default router;