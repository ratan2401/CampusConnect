const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware"); 

router.get("/search", auth, userController.searchUsers);
router.get("/profile", auth, userController.getProfileByToken);
router.get("/profile/:username", auth, userController.getProfileByUsername);
router.get("/friends", auth, userController.getFriends);
router.get("/others", auth, userController.getOtherUsers);
router.post("/addFriend", auth, userController.addFriend);
router.put("/updateProfile", auth, userController.updateProfile);
router.post("/changeProfilePhoto", auth, upload.single("photo"), userController.changeProfilePhoto);
router.post("/sendFriendRequest", auth, userController.sendFriendRequest);
router.post("/acceptFriendRequest", auth, userController.acceptFriendRequest);
router.post("/removeFriend", auth, userController.removeFriend);
router.get("/suggested", auth, userController.getSuggestedFriends);
router.post("/addSkill", auth, userController.addSkill);
router.post("/addExperience", auth, userController.addExperience);
router.post("/deleteSkill", auth, userController.deleteSkill);
router.post("/deleteExperience", auth, userController.deleteExperience);



module.exports = router;