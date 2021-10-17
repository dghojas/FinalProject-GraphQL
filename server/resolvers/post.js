const { authCheck } = require('../helpers/auth');
const Post = require('../models/post');
const User = require('../models/user');

// Queries
const postGetId = async (parent, args, { req }) => {
  const { _id } = args;

  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email
  }).exec();

  const result = await Post.find({
    _id: _id,
    postedBy: currentUserFromDb
  })
    .populate("postedBy", "_id username name createdAt")
    .sort({ createdAt: -1 });

  return result;
};

// Mutation
const postCreate = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  // validation
  if (args.input.content.trim() === '') throw new Error('Content is required');

  const currentUserFromDb = await User.findOne({
    email: currentUser.email
  });
  let newPost = await new Post({
    ...args.input,
    postedBy: currentUserFromDb._id
  })
    .save()
    .then((post) => post.populate("postedBy", "_id username").execPopulate());

  return newPost;
};

const postUpdate = async (parent, args, { req }) => {
  const { _id } = args.input;

  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email
  });

  const updatePost = await Post.findOneAndUpdate(
    { _id: _id },
    { ...args.input },
    { new: true }
  ).exec();

  return updatePost;
};

const postDelete = async (parent, args, { req }) => {
  const { _id } = args.input;
  const currentUser = await authCheck(req);

  try {
    const post = await Post.findById(_id);
    if (post) {
      const deletePost = await post.delete()
        .then((post) => post.populate("postedBy", "_id username").execPopulate());
      return deletePost;
    } else {
      throw new Error('Action not allowed');
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Query generic
const allTodosPost = async (parent, args) => {
  const { offset, limit } = args;
  const currentOffset = offset || 1;

  const totalCount = await Post.find({})
    .populate("postedBy", "username _id")
    .sort({ createdAt: -1 })
    .exec();

  const results = await Post.find({})
    .skip(parseInt((currentOffset - 1) * limit))
    .limit(parseInt(limit))
    .populate("postedBy", "username _id")
    .sort({ createdAt: -1 })
    .exec();

  return {
    todos: results,
    totalCount: totalCount.length
  };
};

const postSearch = async (parent, args) => {
  const { filter = null } = args;
  let searchQuery = {};

  if (filter) {
    // update the search query
    searchQuery = {
      $or: [
        { content: { $regex: filter, $options: 'i' } }
      ]
    };
  }

  // execute query to search users
  const searchFilter = await Post.find(searchQuery)
    .populate("postedBy", "username _id")
    .lean();

  return searchFilter;
};

// Query generic
const postsByUser = async (parent, args, { req }) => {
  const currentUser = await authCheck(req);
  const currentUserFromDb = await User.findOne({
    email: currentUser.email
  }).exec();

  return await Post.find({ postedBy: currentUserFromDb })
    .populate("postedBy", "_id username name createdAt")
    .sort({ createdAt: -1 });
};

module.exports = {
  Query: {
    allTodosPost,
    postSearch,
    postsByUser,
    postGetId
  },
  Mutation: {
    postCreate,
    postUpdate,
    postDelete
  }
};
