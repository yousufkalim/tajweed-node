/**
 * Student CRUD routes
 * @author Najam Ul Saqib
 */
const router = require("express").Router();
const student = require("../controllers/student");
const {
  validateStudent,
  validateStudentUpdate,
  validateLogin,
  changePasswordValidate,
  isValidated,
} = require("../middleware/validators");

const { checkAuth } = require("../middleware/checkAuth");

/**
 ** Routes
 *
 * @method get Get All Student
 * @method post Create student
 * @method put Update Student
 * @method get Get Student By ID
 * @method delete Delete Student
 *
 */

router.get("/", student.getAll);
router.post("/", validateStudent, isValidated, student.create);
router.put("/:studentId", validateStudentUpdate, isValidated, student.update);
router.delete("/:studentId", student.delete);

router.post("/login", validateLogin, isValidated, student.login);
router.get("/auth", checkAuth, student.confirmAuth);
router.put(
  "/password/:studentId",
  changePasswordValidate,
  isValidated,
  student.changePassword
);
router.put("/forgot/:email", student.forgot);

router.get("/:studentId", student.getById);

// Export
module.exports = router;
