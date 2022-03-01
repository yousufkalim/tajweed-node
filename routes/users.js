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
router.post("/email", users.checkEmail);
router.post("/", validateUser, isValidated, users.create);

// Read
router.get("/", users.getAll); // Get all users at once
router.get("/:userId", users.getById); // Get one user by it's id
// Assign Password
router.put(
  "/assignPassword/:userId",
  validatePassword,
  isValidated,
  users.assignPswd
);
router.put("/verifyOTP/:userId", users.verifyOTP);
// Update
router.put("/:userId", validateUserUpdate, isValidated, users.update); // Update a specific user by it's id

// Delete
router.delete("/:userId", users.delete); // delete a specific user by it's id

// Export
module.exports = router;
