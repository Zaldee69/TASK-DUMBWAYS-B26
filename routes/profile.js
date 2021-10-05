const router = require("express").Router();
const dbConnection = require("../connection/db");

//render profile page
router.get("/profile", (req, res) => {
  dbConnection.getConnection((err, conn) => {
    const query = "SELECT * FROM tb_music;";

    conn.query(query, (err, results) => {
      res.render("profile", {
        title: "Profile",
        userName: req.session.user,
        content: results,
        totalMusic: results.length,
      });
    });
    conn.release();
  });
});

module.exports = router;
