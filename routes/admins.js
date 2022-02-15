const router = require("express").Router();
const { register, login, confirmAuth } = require("../controllers/admins");
const { checkAuth } = require("../middleware/checkAuth");

// Admin Register
router.post("/", register);
router.post("/login", login);
router.get("/auth", checkAuth, confirmAuth);

module.exports = router;
