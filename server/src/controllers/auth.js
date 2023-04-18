const db = require("../db");
const { hash } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.getUsers = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT user_id, user_email FROM users`);
    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (user_email, user_password) VALUES ($1 , $2)",
      [email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "The registration was successful!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  let user = req.user;

  let payload = {
    id: user.user_id,
    email: user.user_email,
  };

  try {
    const token = await sign(payload, SECRET);

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({
        sucess: true,
        message: "Logged in succesfully!",
      });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.protectedInfo = async (req, res) => {
  try {
    return res.status(200).json({
      info: "protected info",
    });
  } catch (err) {
    console.error(err.message);
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", { httpOnly: true }).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
};

//function to get users JWT token from request header, idendity the user in the bDB and return their information
exports.getUserInfo = async (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = verify(token, SECRET);
    return res.status(200).json({
      success: true,
      info: decoded,
    });
  } catch (err) {
    console.error(err.message);
  }
};
