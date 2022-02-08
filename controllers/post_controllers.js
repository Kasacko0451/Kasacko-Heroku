const pool = require("../db.js");

exports.display_posts = async function(req, res, next) {
    const user_id = req.user.id
    const res_posts = await pool.query(`SELECT p.*, u.username, v.liked FROM posts AS p 
                                        LEFT JOIN users AS u 
                                            ON p.user_id = u.id 
                                        LEFT JOIN votedposts AS v
                                            ON v.post_id = p.id AND v.user_id=$1
                                        WHERE (p.user_id = $1 OR p.user_id 
                                            IN (SELECT follows_user_id FROM followers 
                                         WHERE follower_user_id = $1)) AND p.deleted = $2`, 
                                        [user_id, false])
    return res.status(200).json(res_posts.rows)
}

exports.get_users_posts = async function(req, res, next) {
    const user = req.body.username
    const res_posts = await pool.query("SELECT * FROM posts WHERE user_id IN (SELECT id FROM users WHERE username = $1) AND deleted = $2", [user, false])
    //if private dont send
    return res.status(200).json(res_posts.rows)
}

exports.post_info = async function(req, res, next) {
    const user_id = req.user.id
    const post_id = req.body.post_id
    const res_post = await pool.query(`SELECT p.*, v.liked, u.username FROM posts p 
                                        LEFT JOIN votedposts v 
                                            ON v.user_id = $1 AND v.post_id = p.id 
                                        INNER JOIN users u 
                                            ON u.id = p.user_id 
                                        WHERE p.id = $2`, 
                                        [user_id, post_id])
    res_post.rows[0].post_created_at = res_post.rows[0].post_created_at.toString()
    res_post.rows[0].post_updated_at = res_post.rows[0].post_updated_at.toString()
    if (res_post.rows[0].deleted === true) {
        res_post.rows[0].post_title = "[REMOVED TITLE]"
        res_post.rows[0].user_id = "[REMOVED]"
        res_post.rows[0].post_content = "[REMOVED CONTENT]"
        res_post.rows[0].username = "[REMOVED USERNAME]"
    } 
    return res.status(200).json(res_post.rows[0])
}

exports.create_post = function (req, res, next) {
    const { post_title, post_content } = req.body
    const user_id = req.user.id
    pool.query("INSERT INTO posts (post_title, post_content, user_id, deleted) VALUES ($1, $2, $3, $4)", [post_title, post_content, user_id, false])
    return res.status(200).json()
}

exports.edit_post = function(req, res, next) {
    const { id, post_content } = req.body
    pool.query("UPDATE posts SET post_content = $1 WHERE id = $2", [post_content, id])
    return res.status(200).json()
}

exports.delete_post = function(req, res, next) {
    const { post_id } = req.body
    pool.query("UPDATE posts SET deleted = $1 WHERE id = $2", [true, post_id])
    return res.status(200).json()
}

exports.vote_post = async function(req, res, next) {
    let islike;
    if (req.body.islike === "true") islike = true
    else islike = false 
    
    const post_id = req.body.post_id
    const user_id = req.user.id
    const res_posts = await pool.query(`SELECT * FROM votedposts WHERE user_id=$1 AND post_id=$2`
                                        , [user_id, post_id])

    if (res_posts.rows.length) {
        if (res_posts.rows[0].liked === islike) {
            pool.query("DELETE FROM votedposts WHERE user_id = $1 AND post_id = $2", [user_id, post_id])
            if (islike === true) {
                pool.query("UPDATE posts SET votes = votes - 1 WHERE id = $1", [post_id])
            } else {
                pool.query("UPDATE posts SET votes = votes + 1 WHERE id = $1", [post_id])
            }
        } else {
            pool.query("UPDATE votedposts SET liked = $1 WHERE user_id = $2 AND post_id = $3", [islike, user_id, post_id])
            if (islike === true) {
                pool.query("UPDATE posts SET votes = votes + 2 WHERE id = $1", [post_id])
            } else {
                pool.query("UPDATE posts SET votes = votes - 2 WHERE id = $1", [post_id])
            }
        }
    } else {
        pool.query("INSERT INTO votedposts (liked, user_id, post_id) VALUES ($1, $2, $3)", [islike, user_id, post_id])
        if (islike === true) {
            pool.query("UPDATE posts SET votes = votes + 1 WHERE id = $1", [post_id])
        } else {
            pool.query("UPDATE posts SET votes = votes - 1 WHERE id = $1", [post_id])
        }
    }
    return res.status(200).json()
}
