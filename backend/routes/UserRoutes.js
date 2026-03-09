const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Signup route
router.post("/signup", UserController.signUp);

// Login route
router.post("/login", UserController.login);

// Get single user route
router.get("/user/:userId", UserController.getSingleUser);

module.exports = router;
