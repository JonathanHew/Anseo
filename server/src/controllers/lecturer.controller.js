const db = require("../db");

exports.createSession = async (req, res) => {
  const { user_id, session_name, module_id } = req.body;
  try {
    await db.query(
      "INSERT INTO sessions (session_name, user_id, module_id) VALUES ($1 , $2, $3)",
      [session_name, user_id, module_id]
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
      `SELECT session_id, session_name, session_date, session_time, session_is_active, session_pin, module_name FROM sessions JOIN modules ON sessions.module_id = modules.module_id WHERE sessions.user_id = $1`,
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

exports.getSessionInfo = async (req, res) => {
  const { session_id } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT session_is_active, session_pin, session_name FROM sessions WHERE session_id = $1`,
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
      `SELECT sessions.session_id, session_name, session_date, session_time, session_pin, module_name FROM sessions JOIN signIns ON sessions.session_id = signIns.session_id JOIN modules ON sessions.module_id = modules.module_id WHERE signin_number = $1 and sessions.user_id = $2`,
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

exports.createModule = async (req, res) => {
  const { user_id, module_name } = req.body;
  try {
    await db.query(
      "INSERT INTO modules (module_name, user_id) VALUES ($1 , $2)",
      [module_name, user_id]
    );

    return res.status(201).json({
      success: true,
      message: "The module was created successfully!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getModules = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT * FROM modules WHERE user_id = $1`,
      [user_id]
    );
    return res.status(200).json({
      success: true,
      modules: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getModulesForStudent = async (req, res) => {
  const { user_id, student_number } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT DISTINCT module_name, modules.module_id from modules join sessions on modules.module_id = sessions.module_id WHERE session_id IN (SELECT sessions.session_id FROM sessions JOIN signIns ON sessions.session_id = signIns.session_id JOIN modules ON sessions.module_id = modules.module_id WHERE signin_number = $1 and sessions.user_id = $2)`,
      [student_number, user_id]
    );
    return res.status(200).json({
      success: true,
      modules: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSignInsForStudentByModuleID = async (req, res) => {
  const { student_number, module_id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT signin_id, signin_date, signin_time, signin_on_campus, session_name, signIns.session_id FROM signIns JOIN sessions ON signIns.session_id = sessions.session_id WHERE signin_number = $1 AND sessions.module_id = $2`,
      [student_number, module_id]
    );
    return res.status(200).json({
      success: true,
      signins: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionsForModule = async (req, res) => {
  const { module_id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT * from sessions where module_id = $1`,
      [module_id]
    );
    return res.status(200).json({
      success: true,
      sessions: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};
