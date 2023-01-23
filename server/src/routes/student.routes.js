const { Router } = require("express");
const { studentSignIn } = require("../controllers/student.controller");
const { validationMiddleware } = require("../middlewares/validations-middleware");
const { studentValidator } = require("../validators/student.validator");
const router = Router();

router.post("/sign-in", studentValidator, validationMiddleware, studentSignIn);

module.exports = router;