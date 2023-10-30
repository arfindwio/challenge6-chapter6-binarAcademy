const router = require("express").Router();
const User = require("./user.routes");
const Post = require("./post.routes");

// API
router.use("/api/v1/users", User);
router.use("/api/v1/posts", Post);

module.exports = router;
