const { check } = require("express-validator");
const db = require("../db");

// check name is not empty
const sessionName = check("session_name")
  .notEmpty()
  .withMessage("Name Required!")

module.exports = {
  sessionValidator: [sessionName],
};