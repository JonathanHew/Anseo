const db = require("../db");

exports.createList = async (req, res) => {
    const { user_id, list_name} = req.body;
    try {
      await db.query(
        "INSERT INTO lists (list_name, user_id) VALUES ($1 , $2)",
        [list_name, user_id]
      );
  
      return res.status(201).json({
        success: true,
        message: "The list was added successfully!",
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  };