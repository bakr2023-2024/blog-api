const express = require("express");
const { isNotAuthenticated, isAuthenticated } = require("../authMiddleware");
const { createUser } = require("../controllers/userController");
const passport = require("passport");
const router = express.Router();

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login");
});
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register");
});
router.post(
  "/login",
  isNotAuthenticated,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home",
    failureFlash: true,
  })
);
router.post("/register", isNotAuthenticated, async (req, res) => {
  try {
    const user = await createUser(req.body);
    req.login(user, (err) => {
      if (err) return res.send("login failed after registration");
      else res.redirect("/home");
    });
  } catch (error) {
    req.flash("error", error);
    res.redirect("/register");
  }
});

router.delete("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    else res.status(200).send("Logout successful");
  });
});
module.exports = router;
