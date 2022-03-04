/**
 * User CRUD routes
 * @author Shuja Naqvi
 */
const router = require("express").Router();
const users = require("../controllers/users");
const { upload } = require("../middleware/multer");
const {
  validateUser,
  validatePassword,
  validateUserUpdate,
  isValidated,
} = require("../middleware/validators");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user signup
 * @method get get all users
 * @method get get user by id
 * @method put update user
 * @method delete delete user
 */

// Create - User Signup
router.get("/email/:email", users.checkEmail);
router.post("/", validateUser, isValidated, users.create);

// Read
router.get("/", users.getAll); // Get all users at once
router.get("/:userId", users.getById); // Get one user by it's id

router.put("/sendotp/:userId", users.assignOtp); // Send OTP
router.put("/verifyOTP/:userId", users.verifyOTP); // Verify OTP
// Update
router.put("/:userId", validateUserUpdate, isValidated, users.update); // Update a specific user by it's id

// Delete
router.delete("/:userId", users.delete); // delete a specific user by it's id

// Export
module.exports = router;
