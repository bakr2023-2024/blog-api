const express = require("express");
const router = express.Router();
const { getAllPosts } = require("../controllers/postController");
router.get("/home", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.render("home", { user:req.user, posts: posts });
  } catch (err) {
    res.json(err);
  }
});
module.exports = router;
