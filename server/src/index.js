const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

// import passport middleware
require("./middlewares/passport-middleware");

// initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// import routes
const authRoute = require("./routes/auth");
const studentRoute = require("./routes/student.routes");
const lecturerRoute = require("./routes/lecturer.routes");

// intitialize routes
app.use("/api", authRoute);
app.use("/api", studentRoute);
app.use("/api", lecturerRoute);

// start app
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}!!!`);
    });
  } catch (err) {
    console.error(err.message);
  }
};

appStart();

module.exports = app;
