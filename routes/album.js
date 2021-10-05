const router = require("express").Router();

// render albums page
router.get("/albums", (req, res) => {
  res.render("albums", { title: "Albums" });
});

module.exports = router;
