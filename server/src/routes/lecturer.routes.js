const { Router } = require("express");
const { createSession, getSessions } = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { sessionValidator } = require("../validators/lecturer.validator");
const router = Router();

router.post("/create-session", sessionValidator, userAuth, createSession);
router.get("/get-sessions", userAuth, getSessions);

module.exports = router;