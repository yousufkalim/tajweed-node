/**
 * User CRUD controllers
 * @author Shuja Naqvi
 */
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendEmail");
const bcryptSalt = process.env.BCRYPT_SALT || 10;

/**
 * Create User - Signup
 * @param {object} req
 * @param {object} res
 */
exports.create = async (req, res) => {
  try {
    let { email } = req.body; // Getting required fields from body
    const existingUser = await Users.findOne({ email }); // Finding already existing user
    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }
    const user = await Users.create(req.body); // Adding user in db
    // Done
    res.json({ success: true, user }); //Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get all users
 * @param {object} req
 * @param {object} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await Users.find(); // Finding all the users from db
    res.json({ success: true, users }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get user by id
 * @param {object} req
 * @param {object} res
 */
exports.getById = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findById(userId); // Finding user by id
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//Assign Password to a user
exports.assignPswd = async (req, res) => {
  try {
    const userId = req.params.userId;
    const password = req.body.password;
    const user = await Users.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.body.password = bcrypt.hashSync(password, parseInt(bcryptSalt)); // Hashing the password with salt 8
    let otp = Math.random().toString(36).slice(-6);
    console.log("otp", otp);
    sendOTP(user.email, otp).then(async () => {
      // If email is sent then we have to update the otp n password in db
      user.password = req.body.password;
      user.otp = otp;
      await user.save();
      // Done
      return res.json({
        success: true,
        message: "Otp successfully sent",
        user,
      });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const userId = req.params.userId;
    const otp = req.body.otp;
    const user = await Users.findById(userId);
    if (user.otp === otp) {
      user.verification = true;
      await user.save();
      return res.json({
        success: true,
        message: "You have been verified",
        user,
      });
    }
    return res.status(404).json({ success: false, message: "OTP is invalid" });
  } catch {
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
/**
 * Update user
 * @param {object} req
 * @param {object} res
 */
exports.update = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndUpdate(userId, req.body, { new: true }); // Updating the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete user
 * @param {object} req
 * @param {object} res
 */
exports.delete = async (req, res) => {
  try {
    const userId = req.params.userId; // Getting user id from URL parameter
    const user = await Users.findByIdAndDelete(userId); // Deleting the user
    res.json({ success: true, user }); // Success
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
