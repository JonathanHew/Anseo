const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  getUserInfo,
} = require("../controllers/auth");
const {
  validationMiddleware,
} = require("../middlewares/validations-middleware");
const { registerValidation, loginValidation } = require("../validators/auth");
const { userAuth } = require("../middlewares/auth-middlware");
const router = Router();

router.get("/get-users", getUsers);
router.get("/protected", userAuth, protected);
router.post("/register", registerValidation, validationMiddleware, register);
router.post("/login", loginValidation, validationMiddleware, login);
router.get("/logout", logout);
router.get("/get-user-info", userAuth, getUserInfo);

module.exports = router;
