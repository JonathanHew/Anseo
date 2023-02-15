const db = require("../db");

exports.studentSignIn = async (req, res) => {
  const { name, number, session_id, longitude, latitude } = req.body;
  let locationCheck = false;

  try {
    if (longitude !== undefined) {
      const { rows } = await db.query(
        `SELECT ST_Intersects(
          (SELECT location_polygon FROM locations WHERE location_id = 1),
          ST_SetSRID (ST_Point($1, $2):: GEOMETRY, 4326))`,
        [longitude, latitude]
      );

      locationCheck = rows[0].st_intersects;
    }

    await db.query(
      "INSERT INTO signIns (signIn_name, signIn_number, session_id, signIn_on_campus) VALUES (INITCAP($1) , UPPER($2), $3, $4)",
      [name, number, session_id, locationCheck]
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
