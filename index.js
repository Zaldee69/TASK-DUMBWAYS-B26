//Import package
const http = require("http");
const express = require("express");
const path = require("path");
const session = require("express-session");
const app = express();
const dbConnection = require("./connection/db");
//routes

const profileRoute = require("./routes/profile");
const artisRoute = require("./routes/artis");
const albumRoute = require("./routes/album");
const songRoute = require("./routes/song");
const authRoute = require("./routes/auth");
const musicRoute = require("./routes/music");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// set views location to app
app.set("views", path.join(__dirname, "views"));

//set view engine
app.set("view engine", "ejs");

//store session
app.use(
  session({
    cookie: {
      maxAge: null,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secretValue",
  })
);

// render home page
app.get("/", function (req, res) {
  dbConnection.getConnection((err, conn) => {
    const query = "SELECT * FROM tb_music;";
    conn.query(query, (err, results) => {
      res.render("home", {
        title: "Music App",
        isLogin: req.session.isLogin,
        userName: req.session.user,
        totalMusic: results.length,
      });
    });
    conn.release();
  });
});

app.use("/", authRoute);
// get routes
app.get("/delete/:id", musicRoute);
app.get("/songs", songRoute);
app.get("/artis", artisRoute);
app.get("/albums", albumRoute);
app.get("/addmusic", musicRoute);
app.get("/editmusic/:id", musicRoute);
app.get("/profile", profileRoute);

//post routes
app.post("/addmusic", musicRoute);
app.post("/editmusic/:id", musicRoute);
app.post("/profile", profileRoute);

const server = http.createServer(app);
const port = 2000;

server.listen(port, () => {
  console.log("Server running on port", port);
});
