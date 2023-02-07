const db = require("../db");

exports.studentSignIn = async (req, res) => {
  const { name, number, session_id } = req.body;

  try {
    await db.query(
      "INSERT INTO signIns (signIn_name, signIn_number, session_id) VALUES (INITCAP($1) , UPPER($2), $3)",
      [name, number, session_id]
    );

    return res.status(201).json({
      success: true,
      message: "The sign was successful!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
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