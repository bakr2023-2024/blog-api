const { Post, User, Comment } = require("../models");
const { ObjectId } = require("mongodb");
const createPost = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = new Post({
        title: data.title,
        content: data.content,
        author: new ObjectId(userId),
      });
      const savedPost = await post.save();
      await User.findByIdAndUpdate(userId, {
        $push: { posts: post._id },
      });
      resolve(savedPost);
    } catch (error) {
      reject("Internal server error");
    }
  });
};
const updatePost = (postId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
        new: true,
      });
      if (updatedPost) {
        resolve(updatedPost);
      } else {
        reject({ error: "Post not found" });
      }
    } catch (err) {
      console.error(err);
      reject({ error: "Internal server error" });
    }
  });
};
const getAllPosts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find()
        .populate({
          path: "author",
        })
        .populate({
          path: "comments",
          populate: {
            path: "author",
          },
        });
      resolve(posts);
    } catch (err) {
      reject({ error: "couldn't get posts" });
    }
  });
};
const getPostsByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ author: userId })
        .populate({ path: "author" })
        .populate({ path: "comments", populate: { path: "author" } });
      resolve(posts);
    } catch (err) {
      reject("user not found");
    }
  });
};
const getPostById = (postId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId)
        .populate({
          path: "author",
        })
        .populate({
          path: "comments",
          populate: {
            path: "author",
          },
        });
      if (post) resolve(post);
      else reject("Post not found");
    } catch (err) {
      reject("Invalid post ID");
    }
  });
};
const deletePost = (postId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findByIdAndDelete(postId,{new:true});
      if (!post) {
        return reject("Post not found");
      }
      await Comment.deleteMany({ post: post._id });
      await User.findByIdAndUpdate(userId, {
        $pull: { posts: post._id },
      });
      await User.updateMany(
        { comments: { $in: post.comments } },
        { $pull: { comments: { $in: post.comments } } }
      );
      resolve("Successfully deleted");
    } catch (err) {
      console.error(err);
      reject("Internal server error");
    }
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  updatePost,
  deletePost,
};
