const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const { registerAdmin, login, refreshToken, logout, getMe, getMyProfile } = require("../controllers/auth.controller");
const { registerValidator, loginValidator } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

// Login: max 10 attempts per 15 min per IP — brute-force protection
const loginLimiter = rateLimit({
    windowMs:        15 * 60 * 1000, // 15 minutes
    max:             10,
    standardHeaders: true,
    legacyHeaders:   false,
    message: {
        success: false,
        message: "Too many login attempts from this IP. Please try again after 15 minutes.",
    },
});

// Register: max 5 registrations per hour per IP
const registerLimiter = rateLimit({
    windowMs:        60 * 60 * 1000, // 1 hour
    max:             5,
    standardHeaders: true,
    legacyHeaders:   false,
    message: {
        success: false,
        message: "Too many registration attempts from this IP. Please try again after 1 hour.",
    },
});

// Refresh token: max 60 per 15 min per IP
const refreshLimiter = rateLimit({
    windowMs:        15 * 60 * 1000,
    max:             60,
    standardHeaders: true,
    legacyHeaders:   false,
    message: {
        success: false,
        message: "Too many token refresh requests. Please try again shortly.",
    },
});

router.post("/admin/register", registerLimiter, registerValidator, validate, registerAdmin);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/refresh-token", refreshLimiter, refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.get("/profile", authenticate, getMyProfile);

module.exports = router;
