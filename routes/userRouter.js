const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { getPostsByUserId } = require("../controllers/postController");
router.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    const posts = await getPostsByUserId(req.params.id);
    res.render("profile", { myUser: req.user, user, posts });
  } catch (err) {
    req.flash("error", err);
    res.render("profile");
  }
});
router.put("/", async (req, res) => {
  try {
    const result = await updateUser(req.user._id, req.body);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
router.delete("/", async (req, res) => {
  try {
    const result = await deleteUser(req.user._id);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
module.exports = router;
