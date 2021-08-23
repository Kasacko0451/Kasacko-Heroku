const pool = require("../db.js");

exports.get_chat = async function(req, res, next) {
    const { id, sendername } = req.body
    const result = await pool.query(`SELECT * FROM chats WHERE (username=$1 AND sendername=$2) 
                                                                OR 
                                                               (sendername=$1 AND username=$2)     
                                    `, [id, sendername])
    return res.status(200).json(result.rows)
}
