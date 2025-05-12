import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import verifyOTP from '../auth/verifyOtp.js';
const verifyOtp = new verifyOTP();
const router = Router();
const validationCheck = [
  check("mobile")
    .exists().withMessage("Mobile number is required").bail()
    .isString().bail()
    .matches(/^\d{10}$/).withMessage("Mobile number must be 10 digits"),

  check("otp")
    .exists().withMessage("OTP is required").bail()
    .isString().bail()
    .matches(/^1\d{3}$/).withMessage("OTP must be 4 digits and start with 1"),
]


router.post("", validationCheck, async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    // Check if the request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errors: "Request body cannot be empty" });
    }

    const errors = validationResult(req);
    // console.log("Errors:", errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.errors[0].msg });
    }
    await verifyOtp.validateOTP(req, res);
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res.status(500).json({ errors: "Internal server error" });
  }
});

export default router;