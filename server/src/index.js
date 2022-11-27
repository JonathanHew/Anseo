const express = require("express");
const app = express();
const {PORT} = require("./constants");

// initialize middlewares 
app.use(express.json());

// import routes
const authRoutes = require('./routes/auth');

// intitialize routes
app.use('/api', authRoutes);

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
