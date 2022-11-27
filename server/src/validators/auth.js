const { check } = require("express-validator");
const db = require("../db");

// password valid check using express-validator
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password must be between 6 and 15 characters!");

// email valid check
const email = check("email").isEmail().withMessage("Invalid Email Address!");

// email already existss check
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * FROM users WHERE user_email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email Already Exists!");
  }
});

module.exports = {
  registerValidation: [email, password, emailExists],
};
