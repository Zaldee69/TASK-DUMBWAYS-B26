const router = require("express").Router();
// const uploadFile = require("../middlewares/uploadFile");
const dbConnection = require("../connection/db");
const multer = require("multer");
let imageName;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    imageName = file.originalname;
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// render add music
router.get("/addmusic", (req, res) => {
  res.render("addmusic", { title: "Add Music" });
});
router.post("/addmusic", upload.single("image"), (req, res) => {
  const { title, image } = req.body;

  const query = `INSERT INTO tb_music (title, cover_music) VALUES (?,?)`;

  if (title === "" && image === "") {
    res.redirect("/addmusic");
  } else {
    dbConnection.getConnection((err, conn) => {
      if (err) throw err;

      conn.query(query, [title, imageName], (err, results) => {
        if (err) throw err;
        req.session.music = {
          title: req.body.title,
          music: req.body.music,
        };
        res.redirect("/profile");
      });

      conn.release();
    });
  }
});

//delete music
router.get("/delete/:id", function (req, res) {
  const { id } = req.params;

  const query = "DELETE FROM tb_music WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], () => {
      res.redirect("/profile");
    });
    conn.release();
  });
});

//edit
router.get("/editmusic/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM tb_music WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) throw err;

      res.render("../views/editmusic", {
        title: "Edit",
        titleMusic: results[0].title,
        // music: results[0].music,
        cover: results[0].cover_music,
        id: results[0].id,
      });
      conn.release();
    });
  });
});

router.post("/editmusic/:id", upload.single("image"), (req, res) => {
  const { id, title } = req.body;

  const image = req.file.filename;

  const query = "UPDATE tb_music SET title = ?, cover_music= ? WHERE id = ?";

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [title, image, id], (err, results) => {
      if (err) throw err;
      res.redirect("/profile");
    });
    conn.release();
  });
});

module.exports = router;
