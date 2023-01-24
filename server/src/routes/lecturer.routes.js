const { Router } = require("express");
const { createSession } = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { sessionValidator } = require("../validators/lecturer.validator");
const router = Router();

router.post("/create-session", sessionValidator, userAuth, createSession);

module.exports = router;