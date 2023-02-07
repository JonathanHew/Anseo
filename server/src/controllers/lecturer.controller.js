const db = require("../db");

exports.createSession = async (req, res) => {
  const { user_id, session_name } = req.body;
  try {
    await db.query(
      "INSERT INTO sessions (session_name, user_id) VALUES ($1 , $2)",
      [session_name, user_id]
    );

    return res.status(201).json({
      success: true,
      message: "The session was created successfully!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getSessions = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT * FROM sessions WHERE user_id = $1`,
      [user_id]
    );
    return res.status(200).json({
      success: true,
      sessions: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getStudentsBySessionId = async (req, res) => {
  const { session_id } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT * FROM SignIns WHERE session_id = $1`,
      [session_id]
    );

    return res.status(200).json({
      success: true,
      students: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.setSessionStatus = async (req, res) => {
  const { session_id } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE sessions SET session_is_active = NOT session_is_active WHERE session_id = $1 returning session_is_active`,
      [session_id]
    );

    return res.status(200).json({
      success: true,
      message: "The session status was set successfully!",
      result: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionStatus = async (req, res) => {
  const { session_id } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT session_is_active FROM sessions WHERE session_id = $1`,
      [session_id]
    );

    return res.status(200).json({
      success: true,
      result: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionsForStudent = async (req, res) => {
  const user_id = req.user.id;
  const { student_number } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT sessions.session_id, session_name, session_date, session_time FROM sessions JOIN signIns ON sessions.session_id = signIns.session_id WHERE signin_number = $1 and user_id = $2`,
      [student_number, user_id]
    );
    return res.status(200).json({
      success: true,
      sessions: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionByPin = async (req, res) => {
  const { session_pin } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT * FROM sessions WHERE session_pin = $1`,
      [session_pin]
    );

    return res.status(200).json({
      success: true,
      result: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};