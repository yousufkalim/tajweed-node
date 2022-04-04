/**
 * All the validation
 * @author Shuja Naqvi
 */
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// You can create multiple validations strategies (Read express-validator documentation for more details)
// User Signup Validation
exports.validateUser = [
  // check("name", "Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  // check("password", "Password is required.").notEmpty().trim(),
  // check("number", "Number is required.").notEmpty().trim(),
];

exports.validatePassword = [
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// User Signup Validation
exports.validateUserUpdate = [
  check("name", "Name is required.").notEmpty().trim(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("number", "Number is required.").notEmpty().trim(),
];

// Login validation
exports.validateLogin = [
  check("email", "Email is required").notEmpty().isEmail().trim().toLowerCase(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

// Change password validation
exports.changePasswordValidate = [
  check("oldPassword", "Old Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("newPassword", "New password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
  check("confirmPassword", "Confirm password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 8 }),
];

exports.validateStudent = [
  check("first_name").notEmpty().withMessage("First name is required").trim(),
  check("last_name").notEmpty().withMessage("Last name is required").trim(),
  check("age")
    .notEmpty()
    .withMessage("Age is required")
    .isNumeric()
    .withMessage("Age can oly be in number")
    .trim(),
  check("phone")
    .optional()
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("gender").notEmpty().withMessage("Gender is required"),
  check("city").notEmpty().withMessage("City is required").trim(),
  check("state").notEmpty().withMessage("State/Province is required").trim(),
  check("country").notEmpty().withMessage("Country is required").trim(),
  check("whatsapp_number")
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("WhatsApp number must be 11 number long")
    .trim(),
  check("email")
    .notEmpty()
    .withMessage("Password is required")
    .isEmail()
    .withMessage("Invalid email")
    .toLowerCase()
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 character long"),
  check("father_phone_number")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("mother_phone_number")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("starting").optional().isDate().withMessage("Invalid Date").trim(),
];
exports.validateStudentUpdate = [
  check("age")
    .optional()
    .isNumeric()
    .withMessage("Age can oly be in number")
    .trim(),
  check("whatsapp_number")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("WhatsApp number must be 11 number long")
    .trim(),
  check("phone")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .toLowerCase()
    .trim(),
  check("father_phone_number")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("mother_phone_number")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 11 })
    .withMessage("Phone number must be 11 number long")
    .trim(),
  check("starting").optional().isDate().withMessage("Invalid Date").trim(),
];

/*
======================
Result
======================
*/

/**
 * To check if request validated successfully or not, according to our validation strategies
 * @param {object} req
 * @param {object} res
 * @param {*} next
 */
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req); // Validating the request by previous middleware's strategy
  if (!errors.isEmpty()) {
    // On error
    console.log(errors.array()[0]);
    res.status(400).send({ success: false, message: errors.array()[0].msg }); // Sending first error to the client from array of errors
  } else {
    // Validated successfully
    next(); // Pass the request to next middleware or controller
  }
};
