const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    body: "Hello from the server!",
  });
});

module.exports = router;
