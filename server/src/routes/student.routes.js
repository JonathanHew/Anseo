const { Router } = require("express");
const { studentSignIn, getSessionByPin } = require("../controllers/student.controller");
const { validationMiddleware } = require("../middlewares/validations-middleware");
const { studentValidator, pinValidator } = require("../validators/student.validator");
const router = Router();

router.post("/sign-in", studentValidator, validationMiddleware, studentSignIn);
router.post("/pin", pinValidator, validationMiddleware, getSessionByPin);

module.exports = router;