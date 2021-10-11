const dbConnection = require("../connection/db");
const router = require("express").Router();

//import bcrypt for password hashing
const bcrypt = require("bcrypt");

//render login page
router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Sign In",
    isLogin: req.session.isLogin,
    message: req.session.message,
  });
});
//render register page
router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Sign Up",
    isLogin: req.session.isLogin,
  });
});

//Logout
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

//Login Handler
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT id,name, email, password FROM tb_users WHERE email = ?";

  if (email == "" && password == "") {
    req.session.message = "Please fulfill input";

    res.redirect("/login");
    return;
  }

  dbConnection.getConnection((err, conn) => {
    req.session.isLogin = false;
    if (err) throw err;

    //execution querry
    conn.query(query, [email], (err, results) => {
      if (err) throw err;

      const isMatch = bcrypt.compareSync(password, results[0].password);

      if (!isMatch) {
        req.session.message = "email or password is incorrect";

        return res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.user = results[0].name;

        return res.redirect("/");
      }
    });
    conn.release();
  });
});

//Handle Register
router.post("/register", (req, res) => {
  const { email, password, name } = req.body;

  const query = "INSERT INTO tb_users (name, email, password) VALUES (?,?,?)";

  const hashedPassword = bcrypt.hashSync(password, 10);

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    // execute query
    conn.query(query, [name, email, hashedPassword], (err, results) => {
      if (err) throw err;
      res.redirect("/login");
    });
    conn.release();
  });
});

module.exports = router;
