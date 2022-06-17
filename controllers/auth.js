/**
 * User auth controllers
 * @author Shuja Naqvi
 */
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_sender = process.env.TWILIO_SENDER;
const client = require("twilio")(accountSid, authToken);

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { phone_number, password } = req.body;

    // Getting user from db
    const user = await Users.findOne({ phone_number });

    if (!user) {
      // If user not found
      console.log(user);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    if (!user.verification) {
      return res
        .status(402)
        .json({ success: false, message: "User not verified" });
    }
    // Creating payload with user object
    const payload = { user };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;

      // done
      res.json({ success: true, user, token });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Change Password
 * @param {object} req
 * @param {object} res
 */
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are not same",
      });
    }

    let user = await Users.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old Password" });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    let { phone_number } = req.params;
    let user = await Users.findOne({ phone_number });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generating random password
    let randomPassword = Math.random().toString(36).substring(2, 10);
    if (client.messages) {
      client.messages
        .create({
          body: `Your temporary  Password is ${randomPassword} `,
          from: twilio_sender,
          to: phone_number,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          return console.error("Got an error:", e.code, e.message);
        });
    }
    user.password = await bcrypt.hash(randomPassword, parseInt(bcryptSalt));
    await user.save();
    res.json({
      success: true,
      message: "Password sent successfully",
      password: randomPassword,
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Confirm auth
 * @param {object} req
 * @param {object} res
 */
exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.user });
};
