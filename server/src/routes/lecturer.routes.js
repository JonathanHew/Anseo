const { Router } = require("express");
const {
  createSession,
  getSessions,
  getStudentsBySessionId,
  setSessionStatus,
  getSessionInfo,
  getSessionsForStudent,
  createModule,
  getModules,
  getModulesForStudent,
  getSignInsForStudentByModuleID,
  getSessionsInModule,
  getStudentModuleReportPieData,
  getStudentModuleReportLineData
} = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { sessionValidator, studentSearchValidator, moduleValidator } = require("../validators/lecturer.validator");
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

router.post("/get-session-info", userAuth, getSessionInfo);

router.post("/search", userAuth, studentSearchValidator, validationMiddleware, getSessionsForStudent);

router.post("/create-module", userAuth, moduleValidator, validationMiddleware, createModule);

router.get("/get-modules", userAuth, getModules);

router.post("/get-student-modules", userAuth, studentSearchValidator, validationMiddleware, getModulesForStudent);

router.post("/get-student-signins-for-module", userAuth, getSignInsForStudentByModuleID);

router.post("/get-sessions-in-module", userAuth, getSessionsInModule);

router.post("/get-student-module-pie-data", userAuth, getStudentModuleReportPieData);

router.post("/get-student-module-line-data", userAuth, getStudentModuleReportLineData)

module.exports = router;
