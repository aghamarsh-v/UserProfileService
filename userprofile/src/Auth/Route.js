const express = require("express");
const router = express.Router();
const { register, login} = require("./Auth");
const {userAuth} = require("../middleware/auth");

router.route("/auth/registerUser").post(register);
router.route("/auth/userLogin").post(login);

module.exports = router;