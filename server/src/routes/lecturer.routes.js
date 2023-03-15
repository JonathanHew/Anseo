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
  validationMiddleware,
  getStudentsBySessionId
);

router.post(
  "/set-session-status",
  userAuth,
  sessionValidator,
  validationMiddleware,
  setSessionStatus
);

router.post(
  "/get-session-info",
  sessionValidator,
  validationMiddleware,
  getSessionInfo
);

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
  validationMiddleware,
  getSignInsForStudentByModuleID
);

router.post(
  "/get-sessions-in-module",
  userAuth,
  moduleValidator,
  validationMiddleware,
  getSessionsInModule
);

router.post(
  "/get-student-module-pie-data",
  userAuth,
  studentModuleValidator,
  validationMiddleware,
  getStudentModuleReportPieData
);

router.post(
  "/get-student-module-line-data",
  userAuth,
  studentModuleValidator,
  validationMiddleware,
  getStudentModulesReportLineData
);

router.post(
  "/get-module-line-data",
  userAuth,
  moduleValidator,
  validationMiddleware,
  getModuleReportLineData
);

router.post(
  "/get-module-bar-data",
  userAuth,
  moduleValidator,
  validationMiddleware,
  getModuleReportBarData
);

router.post(
  "/get-session-charts-data",
  userAuth,
  sessionValidator,
  validationMiddleware,
  getSessionReportData
);

router.post(
  "/get-module-info",
  userAuth,
  moduleValidator,
  validationMiddleware,
  getModuleInfo
);

router.delete(
  "/delete-signin/:signin_id",
  userAuth,
  signinValidator,
  validationMiddleware,
  deleteSignIn
);

router.get("/get-dashboard-data", userAuth, getDashboardData);

module.exports = router;
