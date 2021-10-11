const router = require("express").Router();
const dbConnection = require("../connection/db");
const multer = require("multer");

//set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //set destionation
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// file filter so only image are allowed
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|png|PNG|svg|SVG|mp3|MP3)$/)) {
    req.fileValidationError = {
      message: "Only image files are allowed",
    };

    return cb(new Error("Only image files are allowed", false));
  }

  cb(null, true);
};

// max file size in MB
const sizeMB = 20;
const maxSize = sizeMB * 1024 * 1024;

//upload function
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: maxSize,
  },
});

// render add music
router.get("/addmusic", (req, res) => {
  res.render("addmusic", { title: "Add Music" });
});
router.post(
  "/addmusic",
  upload.fields([
    {
      name: "image",
    },
    {
      name: "music",
    },
  ]),
  (req, res) => {
    const { title } = req.body;
    const music = req.files.music[0].filename;
    const image = req.files.image[0].filename;

    const query = `INSERT INTO tb_music (title,music, cover_music) VALUES (?,?,?)`;

    if (title === "") {
      res.redirect("/addmusic");
    } else {
      dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(query, [title, music, image], (err, results) => {
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
  }
);

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
        music: results[0].music,
        cover: results[0].cover_music,
        id: results[0].id,
      });
      conn.release();
    });
  });
});

router.post(
  "/editmusic/:id",
  upload.fields([
    {
      name: "image",
    },
    {
      name: "music",
    },
  ]),
  (req, res) => {
    const { id, title } = req.body;
    const music = req.files.music[0].filename;
    const image = req.files.image[0].filename;
    const query =
      "UPDATE tb_music SET title = ?, music = ?, cover_music= ? WHERE id = ?";

    dbConnection.getConnection((err, conn) => {
      if (err) throw err;

      conn.query(query, [title, music, image, id], (err, results) => {
        console.log(results);
        if (err) throw err;
        res.redirect("/profile");
      });
      conn.release();
    });
  }
);

module.exports = router;
