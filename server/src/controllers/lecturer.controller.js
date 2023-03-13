const db = require("../db");

exports.createSession = async (req, res) => {
  const user_id = req.user.id;
  const { session_name, module_id } = req.body;
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
      `SELECT session_id, session_name, session_date, session_time, session_is_active, session_pin, module_name FROM sessions JOIN modules ON sessions.module_id = modules.module_id WHERE sessions.user_id = $1 ORDER BY session_date DESC`,
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
      `SELECT sessions.session_id, session_name, session_date, session_time, session_pin, session_is_active, module_name FROM sessions JOIN signIns ON sessions.session_id = signIns.session_id JOIN modules ON sessions.module_id = modules.module_id WHERE signin_number = $1 and sessions.user_id = $2 ORDER BY session_date DESC`,
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
  const user_id = req.user.id;
  const { module_name } = req.body;
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
      `SELECT * FROM modules WHERE user_id = $1 ORDER BY module_name ASC`,
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
  const user_id = req.user.id;
  const { student_number } = req.body;
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
      `SELECT signin_id, signin_date, signin_time, signin_on_campus, session_name, signIns.session_id FROM signIns JOIN sessions ON signIns.session_id = sessions.session_id WHERE signin_number = $1 AND sessions.module_id = $2 ORDER BY signin_date DESC`,
      [student_number, module_id]
    );

    let count = 0;

    rows.forEach((signin) => {
      if (signin.signin_on_campus === true) {
        count++;
      }
    });

    return res.status(200).json({
      success: true,
      signins: rows,
      campusCount: count,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionsInModule = async (req, res) => {
  const { module_id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT * from sessions where module_id = $1 ORDER BY session_date DESC;`,
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

exports.getStudentModuleReportPieData = async (req, res) => {
  const { module_id, student_number } = req.body;

  try {
    const sessionData = await db.query(
      `SELECT COUNT(*) AS session_count FROM sessions WHERE module_id = $1`,
      [module_id]
    );

    const signinData = await db.query(
      `SELECT COUNT(*) AS signin_count FROM signIns JOIN sessions ON signIns.session_id = sessions.session_id WHERE signin_number = $1 AND sessions.module_id = $2`,
      [student_number, module_id]
    );

    return res.status(200).json({
      success: true,
      attendedCount: parseInt(signinData.rows[0].signin_count),
      missedCount:
        sessionData.rows[0].session_count - signinData.rows[0].signin_count,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getStudentModulesReportLineData = async (req, res) => {
  const { module_id, student_number } = req.body;

  try {
    const sessionData = await db.query(
      `SELECT session_id, session_name, session_date FROM sessions WHERE module_id = $1 ORDER BY session_date ASC `,
      [module_id]
    );

    let sessions = sessionData.rows;

    const signinData = await db.query(
      `SELECT signins.session_id, session_name, session_date FROM signIns JOIN sessions ON signIns.session_id = sessions.session_id WHERE signin_number = $1 AND sessions.module_id = $2 ORDER BY session_date ASC`,
      [student_number, module_id]
    );

    let signins = signinData.rows;

    sessions.forEach((session) => {
      signins.forEach((signin) => {
        if (session.session_id.includes(signin.session_id)) {
          session.attended = 1;
        } else {
          if (session.attended !== 1) {
            session.attended = 0;
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      sessions: sessions,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getModuleReportLineData = async (req, res) => {
  const { module_id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT sessions.session_id, session_name, session_date, count(signin_number) FROM sessions LEFT JOIN signins ON sessions.session_id = signins.session_id JOIN modules ON sessions.module_id = modules.module_id WHERE sessions.module_id = $1 GROUP BY session_name, session_date, sessions.session_id ORDER BY sessions.session_date ASC`,
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

exports.getModuleReportBarData = async (req, res) => {
  const { module_id } = req.body;
  let hashmap = {};

  try {
    const { rows } = await db.query(
      `SELECT count(signin_number) FROM sessions LEFT JOIN signins ON sessions.session_id = signins.session_id JOIN modules ON sessions.module_id = modules.module_id WHERE sessions.module_id = $1 GROUP BY session_name, session_date, sessions.session_id ORDER BY sessions.session_date ASC`,
      [module_id]
    );

    rows.forEach((session) => {
      hashmap[session.count] = hashmap[session.count] + 1 || 1;
    });

    return res.status(200).json({
      success: true,
      counts: hashmap,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getSessionReportData = async (req, res) => {
  const { session_id } = req.body;
  let campusCount = 0;

  try {
    const { rows } = await db.query(
      `SELECT * FROM signins where session_id = $1 ORDER BY signin_time ASC`,
      [session_id]
    );

    rows.forEach((signin) => {
      if (signin.signin_on_campus === true) {
        campusCount++;
      }
    });

    return res.status(200).json({
      success: true,
      signins: rows,
      onCampus: campusCount,
      offCampus: rows.length - campusCount,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getModuleInfo = async (req, res) => {
  const { module_id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT module_name FROM modules WHERE module_id = $1`,
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

exports.deleteSignIn = async (req, res) => {
  const { signin_id } = req.params;

  try {
    await db.query(`DELETE FROM signIns WHERE signIn_id = $1`, [signin_id]);

    return res.status(200).json({
      success: true,
      message: "Sign in has been deleted!",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.getDashboardData = async (req, res) => {
  const user_id = req.user.id;

  try {
    const activeSessions = await db.query(
      `SELECT COUNT(*) FROM sessions WHERE user_id = $1 and session_is_active = true`,
      [user_id]
    );

    const studentCount = await db.query(
      `SELECT COUNT(DISTINCT signin_number) FROM signins JOIN sessions ON signins.session_id = sessions.session_id WHERE sessions.user_id = $1`,
      [user_id]
    );

    const signinCount = await db.query(
      `SELECT count(*) FROM signins JOIN sessions ON signins.session_id = sessions.session_id WHERE sessions.user_id = $1`,
      [user_id]
    );

    const moduleCount = await db.query(
      `SELECT count(*) FROM modules WHERE user_id = $1`,
      [user_id]
    );

    return res.status(200).json({
      success: true,
      activeSessions: activeSessions.rows[0].count,
      studentCount: studentCount.rows[0].count,
      signinCount: signinCount.rows[0].count,
      moduleCount: moduleCount.rows[0].count,
    });
  } catch (err) {
    console.error(err.message);
  }
};
