const { Router } = require("express");
const {
  createSession,
  getSessions,
  getStudentsBySessionId,
  setSessionStatus,
  getSessionStatus,
  getSessionsForStudent
} = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { sessionValidator, studentSearchValidator } = require("../validators/lecturer.validator");
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const router = Router();

router.post(
  "/create-session",
  userAuth,
  sessionValidator,
  validationMiddleware,
  createSession
);
router.get("/get-sessions", userAuth, getSessions);

router.post("/get-students-in-session", userAuth, getStudentsBySessionId);

router.post("/set-session-status", userAuth, setSessionStatus);

router.post("/get-session-status", userAuth, getSessionStatus);

router.post("/search", userAuth, studentSearchValidator, validationMiddleware, getSessionsForStudent);

module.exports = router;
