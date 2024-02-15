const { User, Post, Comment } = require("../models");
const { ObjectId } = require("mongodb");

const createComment = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(data.postId);
      if (!post) {
        return reject("Post not found");
      }
      const comment = new Comment({
        text: data.text,
        author: new ObjectId(userId),
        post: new ObjectId(data.postId),
      });
      const savedComment = await comment.save();
      await Post.findByIdAndUpdate(data.postId, {
        $push: { comments: comment._id },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { comments: comment._id },
      });
      resolve(savedComment);
    } catch (error) {
      reject("Internal server error");
    }
  });
};
const updateComment = (commentId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        updatedData,
        { new: true }
      );
      if (updatedComment) {
        resolve(updatedComment);
      } else {
        reject("Comment not found");
      }
    } catch (err) {
      reject("Internal server error");
    }
  });
};
const getComment = (commentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.findById(commentId)
        .populate({
          path: "author",
        })
        .populate({
          path: "post",
        });

      if (comment) {
        resolve(comment);
      } else {
        reject("Comment not found");
      }
    } catch (err) {
      reject("Invalid comment ID");
    }
  });
};
const deleteComment = (commentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.findByIdAndDelete(commentId, { new: true });
      if (!comment) {
        return reject("Comment not found");
      }
      await User.findByIdAndUpdate(comment.author, {
        $pull: { comments: comment._id },
      });
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
      });
      resolve("Successfully deleted");
    } catch (err) {
      console.log(err);
      reject("Internal server error");
    }
  });
};

module.exports = { createComment, updateComment, getComment, deleteComment };
