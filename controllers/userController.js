const { User, Post, Comment } = require("../models");
const bcrypt = require("bcryptjs");
const createUser =  ({ firstname, lastname, username, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userExists = await User.findOne({ username });
      if (userExists) {
        return reject("A user already exists with that name");
      }
      const hash = await bcrypt.hash(password, 10);
      const user = new User({
        firstname,
        lastname,
        username,
        password: hash,
      });

      await user.save();
      resolve(user);
    } catch (err) {
      reject("couldn't create user");
    }
  });
};
const updateUser =  (userId, updatedData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });

      if (updatedUser) {
        resolve(updatedUser);
      } else {
        reject("User not found");
      }
    } catch (err) {
      reject("Internal server error");
    }
  });
};
const getUser =  (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        resolve(user);
      } else {
        reject("User not found");
      }
    } catch (err) {
      reject("Invalid user ID");
    }
  });
};
const deleteUser =  (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return reject("User not found");
      }
      await Promise.all(
        user.posts.map(async (postId) => {
          const post = await Post.findById(postId);
          if (post) {
            await Comment.deleteMany({ post: post._id });
            await post.remove();
          }
        })
      );
      await user.remove();
      resolve("Successfully deleted");
    } catch (err) {
      reject("Internal server error");
    }
  });
};

module.exports = { createUser, updateUser, getUser, deleteUser };
