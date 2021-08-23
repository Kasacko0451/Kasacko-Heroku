const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "g2esportslec12",
  host: "localhost",
  port: 5432,
  database: "kasacko",
});

module.exports = pool;
