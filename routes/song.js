const router = require("express").Router();

//render songs page
router.get("/songs", (req, res) => {
  res.render("songs", { title: "Songs" });
});

module.exports = router;
