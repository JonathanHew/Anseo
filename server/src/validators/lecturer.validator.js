const { check } = require("express-validator");
const db = require("../db");

// check name is not empty
const sessionName = check("session_name")
  .notEmpty()
  .withMessage("Session name can not be empty!");

const sessionID = check("session_id")
  .notEmpty()
  .withMessage("Session ID can not be empty!");

const sessionExists = check("session_id").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * FROM sessions WHERE signIn_number = $1",
    [value]
  );

  if (!rows.length) {
    throw new Error("Session does not exist!");
  }
});

const userId = check("user_id")
  .notEmpty()
  .withMessage("User ID can not be empty");

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

const moduleID = check("module_id")
  .notEmpty()
  .withMessage("Module ID can not be empty!");

const moduleExists = check("module_id").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * FROM modules WHERE module_id = $1",
    [value]
  );

  if (!rows.length) {
    throw new Error("Student does not exist in any sessions!");
  }
});

const validModule = check("module_id")
  .notEmpty()
  .withMessage("Please select a module!")
  .not()
  .equals("-1")
  .withMessage("Please select a module!");

const signinID = check("signin_id")
  .notEmpty()
  .withMessage("Signin ID can not be empty!");

const signinExists = check("signin_id").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * FROM signins WHERE signin_id = $1",
    [value]
  );

  if (!rows.length) {
    throw new Error("Session does not exist!");
  }
});

module.exports = {
  createSessionValidator: [validModule, sessionName],
  studentSearchValidator: [studentNumber, studentExists],
  moduleNameValidator: [moduleName],
  sessionValidator: [sessionID, sessionExists],
  studentModuleValidator: [
    studentNumber,
    studentExists,
    moduleID,
    moduleExists,
  ],
  moduleValidator: [moduleID, moduleExists],
  signinValidator: [signinID, signinExists],
};
