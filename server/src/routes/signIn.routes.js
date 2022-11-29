const { Router } = require("express");
const { signIn } = require("../controllers/signIn.controller");
const { validationMiddleware } = require("../middlewares/validations-middleware");
const { signInValidation } = require("../validators/signIn.validator");
const router = Router();

router.post("/sign-in", signInValidation, validationMiddleware, signIn);

module.exports = router;