const router = require("express").Router();
const dbConnection = require("../connection/db");

// render albums page
router.get("/artis", (req, res) => {
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;
    const query = "SELECT * FROM tb_artis;";

    conn.query(query, (err, results) => {
      res.render("artis", { title: "Artis", data: results });
    });
    conn.release();
  });
});

router.get("/artis/profile/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM tb_artis WHERE id = ?";
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) throw err;
      res.render("../views/artis_profile.ejs", {
        title: "Artis Profile",
        name: results[0].name,
        startCareer: results[0].start_career,
        photo: results[0].photo,
        about: results[0].about,
      });
    });
    conn.release();
  });
});

module.exports = router;
