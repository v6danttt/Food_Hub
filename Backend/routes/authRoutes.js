const express = require("express");
const router = express.Router();

const { registerUser } = require("../configure/controllers/authcontroller");

router.post("/register", registerUser);

module.exports = router;