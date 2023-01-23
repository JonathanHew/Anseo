const { check } = require("express-validator");
const db = require("../db");

// check if student has already signed into the list
const studentExists = check("number").custom(async (value, { req }) => {
  const { rows } = await db.query(
    "SELECT * FROM signIns WHERE signIn_number = $1 AND list_id = $2",
    [value, req.body.list_id]
  );

  if (rows.length) {
    throw new Error("Student already signed in!");
  }
});

// check student number is 9 digits long
const studentNumber = check("number")
  .isLength(9)
  .withMessage("Student number should be 9 charachters long!");

// check name is not empty and is alphabetic
const studentName = check("name")
  .notEmpty()
  .withMessage("Name Required!")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Name must be alphabetic.");

module.exports = {
  studentValidator: [studentNumber, studentExists, studentName],
};
