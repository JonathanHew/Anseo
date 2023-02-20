const { check } = require("express-validator");
const db = require("../db");

// check name is not empty
const sessionName = check("session_name")
  .notEmpty()
  .withMessage("Session name can not be empty!");

const userId = check("user_id").notEmpty().withMessage("User ID not found!");

const studentNumber = check("student_number")
  .isLength(9)
  .withMessage("Student number should be 9 characters long!");

const studentExists = check("student_number").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * FROM signIns WHERE signIn_number = $1",
    [value]
  );

  if (!rows.length) {
    throw new Error("Student does not exist in any sessions!");
  }
});

const moduleName = check("module_name")
  .notEmpty()
  .withMessage("Module name can not be empty!");

module.exports = {
  sessionValidator: [sessionName, userId],
  studentSearchValidator: [studentNumber, studentExists],
  moduleValidator: [moduleName, userId],
};
