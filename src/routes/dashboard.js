const express = require("express");
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/otp", (req, res) => {
  res.render("otp");
});

module.exports = router;
