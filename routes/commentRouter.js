const express = require("express");
const router = express.Router();
const {
  createComment,
  getComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
router.post("/", async (req, res) => {
  try {
    const result = await createComment(req.body, req.user._id);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
router.get("/:commentId", async (req, res) => {
  try {
    const comment = await getComment(req.params.commentId);
    res.json(comment);
  } catch (err) {
    res.send(err);
  }
});
router.delete("/:commentId", async (req, res) => {
  try {
    const result = await deleteComment(req.params.commentId);
    req.flash("success", result);
    res.status(200).send(result);
  } catch (err) {
    req.flash("error", err);
    res.status(400).send(err);
  }
});
router.put("/:commentId", async (req, res) => {
  try {
    const result = await updateComment(req.params.commentId, req.body);
    req.flash("success", result);
    res.sendStatus(200);
  } catch (err) {
    req.flash("error", err);
    res.sendStatus(400);
  }
});
module.exports = router;
