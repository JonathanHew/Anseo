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
  getStudentModulesReportLineData,
  getModuleReportLineData,
  getModuleReportBarData,
  getSessionReportData,
  getModuleInfo,
  deleteSignIn,
  getDashboardData,
} = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const {
  createSessionValidator,
  studentSearchValidator,
  moduleNameValidator,
  sessionValidator,
  studentModuleValidator,
  moduleValidator,
  signinValidator,
} = require("../validators/lecturer.validator");
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const router = Router();

router.post(
  "/create-session",
  userAuth,
  createSessionValidator,
  validationMiddleware,
  createSession
);
router.get("/get-sessions", userAuth, getSessions);

router.post(
  "/get-students-in-session",
  userAuth,
  sessionValidator,
  getStudentsBySessionId
);

router.post(
  "/set-session-status",
  userAuth,
  sessionValidator,
  setSessionStatus
);

router.post("/get-session-info", userAuth, sessionValidator, getSessionInfo);

router.post(
  "/search",
  userAuth,
  studentSearchValidator,
  validationMiddleware,
  getSessionsForStudent
);

router.post(
  "/create-module",
  userAuth,
  moduleNameValidator,
  validationMiddleware,
  createModule
);

router.get("/get-modules", userAuth, getModules);

router.post(
  "/get-student-modules",
  userAuth,
  studentSearchValidator,
  validationMiddleware,
  getModulesForStudent
);

router.post(
  "/get-student-signins-for-module",
  userAuth,
  studentModuleValidator,
  getSignInsForStudentByModuleID
);

router.post(
  "/get-sessions-in-module",
  userAuth,
  moduleValidator,
  getSessionsInModule
);

router.post(
  "/get-student-module-pie-data",
  userAuth,
  studentModuleValidator,
  getStudentModuleReportPieData
);

router.post(
  "/get-student-module-line-data",
  userAuth,
  studentModuleValidator,
  getStudentModulesReportLineData
);

router.post(
  "/get-module-line-data",
  userAuth,
  moduleValidator,
  getModuleReportLineData
);

router.post(
  "/get-module-bar-data",
  userAuth,
  moduleValidator,
  getModuleReportBarData
);

router.post(
  "/get-session-charts-data",
  userAuth,
  sessionValidator,
  getSessionReportData
);

router.post("/get-module-info", userAuth, moduleValidator, getModuleInfo);

router.delete(
  "/delete-signin/:signin_id",
  userAuth,
  signinValidator,
  deleteSignIn
);

router.get("/get-dashboard-data", userAuth, getDashboardData);

module.exports = router;
