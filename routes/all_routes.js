const express = require("express");
const router = express.Router();
const comment_controllers = require("../controllers/comment_controllers");
const post_controllers = require("../controllers/post_controllers");
const user_controllers = require("../controllers/user_controllers");
const chat_controllers = require("../controllers/chat_controllers");

// POST ROUTES
router.post("/get_users_posts", post_controllers.get_users_posts);

router.get("/display_posts", post_controllers.display_posts);

router.post("/post_info", post_controllers.post_info);

router.post("/create_post", post_controllers.create_post);

router.post("/edit_post", post_controllers.edit_post);

router.post("/delete_post", post_controllers.delete_post);

router.put("/vote_post", post_controllers.vote_post);

// COMMENT ROUTES
router.post("/get_users_comments", comment_controllers.get_users_comments);

router.post("/get_comments", comment_controllers.get_comments);

router.post("/create_comment", comment_controllers.create_comment);

router.put("/edit_comment", comment_controllers.edit_comment);

router.delete("/delete_comment", comment_controllers.delete_comment);

router.put("/vote_comment", comment_controllers.vote_comment);

// USER ROUTES
router.get("/display_follows", user_controllers.display_follows);

router.get("/user_info", user_controllers.user_info);

router.put("/edit_user", user_controllers.edit_user);

router.put("/delete_user", user_controllers.delete_user);

router.get("/display_follow_requests", user_controllers.display_follow_requests);

router.get("/private_user", user_controllers.private_user);

router.get("/unprivate_user", user_controllers.unprivate_user);

router.post("/display_userprofile", user_controllers.display_userprofile);

router.post("/accept_follow", user_controllers.accept_follow);

router.post("/decline_follow", user_controllers.decline_follow);

router.post("/follow_user", user_controllers.follow_user);

router.post("/unfollow_user", user_controllers.unfollow_user);

router.post("/search_users", user_controllers.search_users);

// CHAT ROUTES
router.post("/get_chat", chat_controllers.get_chat);

module.exports = router;
