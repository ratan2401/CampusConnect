const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const postController = require("../controllers/postController");
const upload = require("../middlewares/uploadMiddleware"); 
const { deletePost } = require("../controllers/postController");


router.get("/feed", auth, postController.getFeed);
router.get("/user/:username", auth, postController.getUserPosts);
router.post("/", auth, upload.single('file'), postController.createPost);
router.post("/like/:postId", auth, postController.likePost);
router.post("/comment/:postId", auth, postController.commentPost);
router.get("/share/:postId", auth, postController.sharePost);
router.get("/smartfeed", auth, postController.getSmartFeed);
router.delete("/deletePost/:id", auth, deletePost);


module.exports = router;
