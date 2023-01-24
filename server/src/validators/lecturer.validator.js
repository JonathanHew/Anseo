const { check } = require("express-validator");
const db = require("../db");

// check name is not empty
const listName = check("list_name")
  .notEmpty()
  .withMessage("Name Required!")

module.exports = {
  listValidator: [listName],
};