const { Router } = require("express");
const {
  createSession,
  getSessions,
  getStudentsBySessionId,
} = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { sessionValidator } = require("../validators/lecturer.validator");
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

router.get("/get-students-in-session", userAuth, getStudentsBySessionId);

module.exports = router;
