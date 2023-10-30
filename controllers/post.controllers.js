const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const imagekit = require("../libs/imagekit");

module.exports = {
  // upload image
  createPost: async (req, res, next) => {
    try {
      const { title, description } = req.body;
      let strFile = req.file.buffer.toString("base64");

      let { url, fileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      const newPost = await prisma.post.create({
        data: { title, description, image: url, userId: req.user.id, imageId: fileId },
      });

      return res.status(201).json({
        status: true,
        message: "OK",
        data: { newPost },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get All Post User
  getAllPostUser: async (req, res, next) => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          userId: Number(req.user.id),
        },
      });

      if (posts.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Post not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "OK",
        data: { posts },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get Detail Post User
  getDetailPostUser: async (req, res, next) => {
    try {
      const postId = req.params.id;

      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
          userId: Number(req.user.id),
        },
      });

      if (!post) {
        return res.status(404).json({
          status: false,
          message: "Post not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "OK",
        data: { post },
      });
    } catch (err) {
      next(err);
    }
  },

  //   Delete Post User
  deletePostUser: async (req, res, next) => {
    try {
      const postId = req.params.id;

      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
          userId: Number(req.user.id),
        },
      });

      if (!post) {
        return res.status(404).json({
          status: false,
          message: "Post not found",
        });
      }

      imagekit.deleteFile(post.imageId, (error, result) => {
        if (error) console.log(error);
        else console.log(result);
      });

      await prisma.post.delete({
        where: {
          id: Number(post.id),
          userId: Number(post.userId),
        },
      });

      return res.status(200).json({
        status: true,
        message: "Post deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  //   Update Title and Description Post User
  updatePostUser: async (req, res, next) => {
    try {
      const postId = req.params.id;
      const { title, description } = req.body;

      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
          userId: Number(req.user.id),
        },
      });

      if (!post) {
        return res.status(404).json({
          status: false,
          message: "Post not found",
        });
      }

      const newPost = await prisma.post.update({
        where: {
          id: Number(post.id),
          userId: Number(post.userId),
        },
        data: { title, description },
      });

      return res.status(200).json({
        status: true,
        message: "OK",
        data: { newPost },
      });
    } catch (err) {
      next(err);
    }
  },
};
