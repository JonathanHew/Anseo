const { Router } = require("express");
const { createList } = require("../controllers/lecturer.controller");
const { userAuth } = require("../middlewares/auth-middlware");
const { listValidator } = require("../validators/lecturer.validator");
const router = Router();

router.post("/create-list", listValidator, userAuth, createList);

module.exports = router;