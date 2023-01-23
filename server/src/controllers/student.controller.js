const db = require("../db");

exports.studentSignIn = async (req, res) => {
    const { name, number, list_id } = req.body;
    try {
      await db.query(
        "INSERT INTO signIns (signIn_name, signIn_number, list_id) VALUES ($1 , $2, $3)",
        [name, number, list_id]
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