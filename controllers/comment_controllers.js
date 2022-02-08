const pool = require("../db.js");

exports.get_users_comments = async function(req, res, next) {
    const user = req.body.user
    const res_comments = await pool.query(`
                                        SELECT * FROM comments 
                                        WHERE user_id 
                                        IN (SELECT id FROM users WHERE username = $1)`, 
                                        [user])

    res_comments.rows.forEach(com => {
        if (com.deleted === true) {
            com.user_id = "[REMOVED]"
            com.comment_content = "[REMOVED CONTENT]"
            com.username = "[REMOVED USERNAME]"
        }
    });
    
    return res.status(200).json(res_comments.rows)
}

exports.get_comments = async function(req, res, next) {
    const post_id = req.body.post_id
    const user_id = req.user.id
    const res_comments = await pool.query(`
                                        SELECT c.*, u.username, v.liked FROM comments AS c 
                                        LEFT JOIN users AS u 
                                            ON u.id = c.user_id 
                                        LEFT JOIN votedcomments AS v 
                                            ON v.comment_id = c.id AND v.user_id=$2
                                        WHERE post_id = $1`, 
                                        [post_id, user_id])

    res_comments.rows.forEach(com => {
        if (com.deleted === true) {
            com.user_id = "[REMOVED]"
            com.comment_content = "[REMOVED CONTENT]"
            com.username = "[REMOVED USERNAME]"
        }
    });

    return res.status(200).json(res_comments.rows)
}

exports.create_comment = function(req, res, next) {
    const { comment_content, post_id } = req.body
    const user_id = req.user.id
    pool.query("INSERT INTO comments (user_id, post_id, comment_content, deleted) VALUES($1, $2, $3, $4)", [user_id, post_id, comment_content, false])
    pool.query("UPDATE posts SET num_of_comments = num_of_comments + 1 WHERE id = $1", [post_id])
    return res.status(200).json()
}

exports.edit_comment = function(req, res, next) {
	const { edit_comment_content, comment_id } = req.body
    pool.query("UPDATE comments SET comment_content = $1 WHERE id = $2", [edit_comment_content, comment_id])
    return res.status(200).json()
}

exports.delete_comment = function(req, res, nexr) {
    const { comment_id } = req.body
    pool.query("UPDATE comments SET deleted = $1 WHERE id = $2", [true, comment_id])
    return res.status(200).json()
}

exports.vote_comment = async function(req, res, next) {
    let islike;
    if (req.body.islike === "true") islike = true
    else islike = false 

    const comment_id = req.body.comment_id
    const user_id = req.user.id
    const res_comments = await pool.query(`SELECT * FROM votedcomments WHERE user_id=$1 AND comment_id=$2`
                                            ,[user_id, comment_id])

    if (res_comments.rows.length) {
        if (res_comments.rows[0].liked === islike) {
            pool.query("DELETE FROM votedcomments WHERE user_id = $1 AND comment_id = $2", [user_id, comment_id])
            if (islike === true) {
                pool.query("UPDATE comments SET votes = votes - 1 WHERE id = $1", [comment_id])
            } else {
                pool.query("UPDATE comments SET votes = votes + 1 WHERE id = $1", [comment_id])
            }
        } else {
            pool.query("UPDATE votedcomments SET liked = $1 WHERE user_id = $2 AND comment_id = $3", [islike, user_id, comment_id])
            if (islike === true) {
                pool.query("UPDATE comments SET votes = votes + 2 WHERE id = $1", [comment_id])
            } else {
                pool.query("UPDATE comments SET votes = votes - 2 WHERE id = $1", [comment_id])
            }
        }
    } else {
        pool.query("INSERT INTO votedcomments (liked, user_id, comment_id) VALUES ($1, $2, $3)", [islike, user_id, comment_id])
        if (islike === true) {
            pool.query("UPDATE comments SET votes = votes + 1 WHERE id = $1", [comment_id])
        } else {
            pool.query("UPDATE comments SET votes = votes - 1 WHERE id = $1", [comment_id])
        }
    }
    return res.status(200).json()
}
