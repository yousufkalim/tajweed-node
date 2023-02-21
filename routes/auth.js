/**
 * User auth routes
 * @author Shuja Naqvi
 */
const router = require('express').Router();
const auth = require('../controllers/auth');
const { checkAuth } = require('../middleware/checkAuth');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const {
  validateLogin,
  isValidated,
  validateForgetPassword,
  changePasswordValidate,
} = require('../middleware/validators');

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post user login
 * @method get check auth
 * @method put change password
 * @method post forgot email
 */

// Read
router.post('/login', validateLogin, isValidated, auth.login); // Get all users at once
router.get('/', checkAuth, auth.confirmAuth);
router.put(
  '/password/:userId',
  changePasswordValidate,
  isValidated,
  auth.changePassword,
); // Change password route
router.put(
  '/forgot/:phone_number',
  validateForgetPassword,
  isValidated,
  auth.forgot,
);

// Export
module.exports = router;
