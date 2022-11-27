const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "anseo_v2",
  password: "postgres123",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
