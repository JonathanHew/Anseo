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
      count: rows.length,
    });
  } catch (err) {
    console.error(err.message);
  }
};
