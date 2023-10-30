const router = require("express").Router();
const { createPost, getAllPostUser, getDetailPostUser, deletePostUser, updatePostUser } = require("../controllers/post.controllers");
const { image } = require("../libs/multer");
const Auth = require("../middlewares/authentication");

router.post("/", Auth, image.single("image"), createPost);
router.get("/", Auth, getAllPostUser);
router.get("/:id", Auth, getDetailPostUser);
router.delete("/:id", Auth, deletePostUser);
router.put("/:id", Auth, updatePostUser);

module.exports = router;
