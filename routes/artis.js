const router = require("express").Router();

// render albums page
router.get("/artis", (req, res) => {
  res.render("artis", { title: "Artis" });
});

module.exports = router;
