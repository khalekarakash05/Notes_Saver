// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { signUp, logIn, getUserProfile } = require("../controllers/userController");
const { auth } = require("../middleware/userMiddleware");

router.post("/signup", signUp);
router.post("/login", logIn);

router.get("/profile",auth, getUserProfile);

module.exports = router;