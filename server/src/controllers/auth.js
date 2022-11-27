const db = require("../db");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM users`);
    console.log(rows);
  } catch (err) {
    console.error(err.message);
  }
};

exports.register = async (req, res) => {
  try {
    console.log("Register Validation Passed!"); 
  } catch (err) {
    console.error(err.message);
  }
};
