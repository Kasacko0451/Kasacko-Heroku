const pool = require("../db.js");

exports.display_follows = async function(req, res, next) {
    const res_follows = await pool.query("SELECT username, id FROM users WHERE NOT username=$1 AND NOT deleted=$2 LIMIT 5", [req.user.username, true])
    return res.status(200).json(res_follows.rows)
}

exports.user_info = async function(req, res, next) {
    const res_user = await pool.query("SELECT * FROM users WHERE username=$1", [req.user.username])
    return res.status(200).json(res_user.rows[0])
}

exports.edit_user = function (req, res, next) {
    const { picture, sex, bio, age } = req.body
    pool.query("UPDATE userprofiles SET age=$1, sex=$2, bio=$3, picture=$4 WHERE user_id = $5", [age, sex, bio , picture, req.user.id])
    return res.status(200).json()
}

exports.private_user = function(req, res, next) {
    pool.query("UPDATE users SET private_profile=$1 WHERE id=$2", [true, req.user.id])
    return res.status(200).json()
}

exports.unprivate_user = function(req, res, next) {
    pool.query("UPDATE users SET private_profile=$1 WHERE id=$2", [false, req.user.id])
    return res.status(200).json()
}

exports.delete_user = function (req, res, next) {
    pool.query("UPDATE users SET deleted=$1 WHERE id=$2", [true, req.user.id])
    pool.query("DELETE userprofiles WHERE user_id=$1", [req.user.id])
    pool.query("DELETE followers WHERE follower_user_id=$1", [req.user.id])
    pool.query("UPDATE posts SET deleted=$1 WHERE user_id=$2", [true, req.user.id])
    pool.query("UPDATE comments SET deleted=$1 WHERE user_id=$2", [true, req.user.id])
    return res.status(200).json()
}

exports.display_userprofile = async function (req, res, next) {
    if (req.body.user === req.user.username) {
        const res_profile = await pool.query(`SELECT * FROM userprofiles WHERE user_id = $1`, [req.user.id])
        return res.status(200).json(res_profile.rows[0])
    } else { 
        const res_profile = await pool.query(
                                        `SELECT u.id, u.username, up.*, f.follower_user_id, fr.follows_user_id FROM users AS u
                                         INNER JOIN userprofiles AS up
                                            ON u.id = up.user_id
                                         LEFT JOIN followers AS f
                                            ON f.follower_user_id = $1 AND f.follows_user_id = u.id
                                         LEFT JOIN followers_requests AS fr
                                            ON fr.follower_user_id = $1 AND fr.follows_user_id = u.id
                                         WHERE u.username = $2`, 
                                        [req.user.id, req.body.user])
        if (res_profile?.rows[0]?.follower_user_id) {
            return res.status(200).json({...res_profile.rows[0], follows: true })
        } else {
            if (res_profile.rows.follows_user_id) {
                return res.status(200).json({...res_profile.rows[0], waiting_follow: true })                                        
            } else {
                return res.status(200).json({ ...res_profile.rows[0] })
            }  
        }
    }
}

exports.display_follow_requests = async function (req, res, next) {
    const res_req = await pool.query("SELECT u.username, u.id FROM followers_requests f INNER JOIN users u ON u.id = f.follower_user_id WHERE f.follows_user_id=$1", [req.user.id])
    return res.status(200).json(res_req.rows)
}

exports.accept_follow = async function (req, res, next) {
    const user_id = req.body.user_id
    pool.query("DELETE FROM followers_requests WHERE follows_user_id = $1 AND follower_user_id = $2", [req.user.id, user_id])
    pool.query("INSERT INTO followers (follows_user_id, follower_user_id) VALUES($1, $2)", [req.user.id, user_id])
    return res.status(200).json()
}

exports.decline_follow = async function (req, res, next) {
    const user_id = req.body.user_id
    pool.query("DELETE FROM followers_requests WHERE follows_user_id = $1 AND follower_user_id = $2", [req.user.id, user_id])
    return res.status(200).json()
}

exports.follow_user = async function (req, res, next) {
    const result = await pool.query("SELECT * FROM users u WHERE u.username = $1", [req.body.user])

    if (result.rows[0].private_profile) {
        const res_follow = await pool.query("SELECT * FROM followers_requests WHERE follower_user_id=$1 AND follows_user_id=$2", [req.user.id, result.rows[0].id])

        if (!res_follow.rows.length) {
            pool.query("INSERT INTO followers_requests (follower_user_id, follows_user_id) VALUES($1, $2)", [req.user.id, result.rows[0].id])
        }
    } else {
        const res_follow = await pool.query("SELECT * FROM followers WHERE follower_user_id=$1 AND follows_user_id=$2", [req.user.id, result.rows[0].id])
        
        if (!res_follow.rows.length) {
            pool.query("INSERT INTO followers (follower_user_id, follows_user_id) VALUES($1, $2)", [req.user.id, result.rows[0].id])
        }
    }

    return res.status(200).json()
}

exports.unfollow_user = async function (req, res, next) {
    const res_id = await pool.query("SELECT id FROM users WHERE username = $1", [req.body.user])
    pool.query("DELETE FROM followers WHERE follower_user_id = $1 AND follows_user_id = $2", [req.user.id, res_id.rows[0].id])
    return res.status(200).json()
}

exports.search_users = async function (req, res, next) {
    const { searchterm } = req.body
    
    if (searchterm) {
        const result = await pool.query(`SELECT * FROM userprofiles WHERE username ILIKE $1`, 
                                         ['%' + searchterm + '%'])

        if (result.rows.length) return res.status(200).json(result.rows)

        return res.status(200).json([{nousers: "No users found..."}])

    } else return res.status(200).json([{nousers: "No users found..."}])
}
