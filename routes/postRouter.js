const express = require("express");
const router = express.Router();
const {
  createPost,
  getPostById,
  deletePost,
  updatePost,
} = require("../controllers/postController");
router.post("/", async (req, res) => {
  try {
    const result = await createPost(req.body, req.user._id);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.send(err);
  }
});
router.delete("/:postId", async (req, res) => {
  try {
    const result = await deletePost(req.params.postId);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const result = await updatePost(req.params.id, req.body);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
module.exports = router;
