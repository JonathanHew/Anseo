const { Router } = require("express");
const {
  createSession,
  getSessions,
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

module.exports = router;
