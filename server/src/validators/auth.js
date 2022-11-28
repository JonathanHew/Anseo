const { check } = require("express-validator");
const db = require("../db");
const { compare } = require("bcryptjs");

// password valid check using express-validator
const password = check("password")
  .isLength({ min: 6, max: 15 })
  .withMessage("Password must be between 6 and 15 characters!");

// email valid check
const email = check("email").isEmail().withMessage("Invalid email address!");

// email already existss check
const emailExists = check("email").custom(async (value) => {
  const { rows } = await db.query("SELECT * FROM users WHERE user_email = $1", [
    value,
  ]);

  if (rows.length) {
    throw new Error("Email already exists!");
  }
});

// login validation
const loginFieldsCheck = check("email").custom(async (value, { req }) => {
  const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
    value,
  ]);

  if (!user.rows.length) {
    throw new Error("This email does not exist!");
  }

  // check password if email exists
  const validPassword = await compare(
    req.body.password,
    user.rows[0].user_password
  );

  if (!validPassword) {
    throw new Error("Password is incorrect!");
  }

  req.user = user.rows[0];
});

module.exports = {
  registerValidation: [email, password, emailExists],
  loginValidation: [loginFieldsCheck],
};
