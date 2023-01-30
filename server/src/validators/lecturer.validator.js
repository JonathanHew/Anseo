const { check } = require("express-validator");
const db = require("../db");

// check name is not empty
const sessionName = check("session_name")
  .notEmpty()
  .withMessage("Session name must not be empty");

const userId = check("user_id")
  .notEmpty()
  .withMessage("User ID not found!");

module.exports = {
  sessionValidator: [ sessionName, userId],
};
