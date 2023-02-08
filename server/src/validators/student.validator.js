const { check } = require("express-validator");
const db = require("../db");

// check if student has already signed into the list
const studentExists = check("number").custom(async (value, { req }) => {
  const { rows } = await db.query(
    "SELECT * FROM signIns WHERE signIn_number = $1 AND session_id = $2",
    [value, req.body.session_id]
  );

  if (rows.length) {
    throw new Error("Student already signed in!");
  }
});

// check student number is 9 digits long
const studentNumber = check("number")
  .isLength(9)
  .withMessage("Student number should be 9 characters long!");

// check name is not empty and is alphabetic
const studentName = check("name")
  .notEmpty()
  .withMessage("Name Required!")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("Name must be alphabetic.");

const pinNumber = check("session_pin")
  .isLength({ min: 6, max: 6 })
  .withMessage("PIN Code Should be 6 characters long!")
  .isAlphanumeric()
  .withMessage("PIN Code should only contain letters and numbers!");

const pinExists = check("session_pin").custom(async (value) => {
  const { rows } = await db.query(
    "SELECT * FROM sessions WHERE session_pin = $1",
    [value]
  );

  if (!rows.length) {
    throw new Error("PIN does not exist, Please double check and try again!");
  }
});


const sessionStatus = check("session_id").custom(async (value) => {
  const {rows} = await db.query(
    "SELECT session_is_active FROM sessions WHERE session_id = $1",
    [value]
  );

  if (!rows[0].session_is_active) {
    throw new Error("Session is no longer active!");
  }
});

module.exports = {
  studentValidator: [sessionStatus, studentNumber, studentExists, studentName],
  pinValidator: [pinNumber, pinExists],
};
