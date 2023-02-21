/**
 * User auth controllers
 * @author Shuja Naqvi
 */
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio_sender = process.env.MESSAGING_ID;
const client = require('twilio')(accountSid, authToken);

/**
 * Login
 * @param {object} req
 * @param {object} res
 */
exports.login = async (req, res) => {
  try {
    // Getting email and password
    var user = {};
    const { phone_number, password, email } = req.body;

    // Getting user from db
    if (phone_number) {
      user = await Users.findOne({ phone_number });

      if (!user) {
        // If user not found
        console.log(user);
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
    }
    if (email) {
      user = await Users.findOne({ email });

      if (!user) {
        // If user not found
        console.log(user);
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
    }
    // Comparing password
    const isMatched = bcrypt.compareSync(password, user.password);

    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Password' });
    }

    if (!user.verification) {
      return res
        .status(402)
        .json({ success: false, message: 'User not verified' });
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
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
        message: 'New password and confirm password are not same',
      });
    }

    let user = await Users.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const isMatched = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid old Password' });
    }

    // Generate token
    user.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Forgot password
 * @param {object} req
 * @param {object} res
 */
exports.forgot = async (req, res) => {
  try {
    var user = {};
    let { phone_number } = req.params;
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Generating random otp

    user = await Users.findOne({ phone_number });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'User not found with provided phone number',
        });
    }
    if (client.messages) {
      client.messages
        .create({
          body: `Please confirm your phone number,Your One Time Password is ${otp}.... :)`,
          messagingServiceSid: twilio_sender,
          to: phone_number,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          return console.error('Got an error:', e.code, e.message);
        });
    }

    user.otp = otp;
    user.verification = false;
    await user.save();
    res.json({
      success: true,
      message: 'Otp sent successfully',
      otp: otp,
      user,
    });
  } catch (err) {
    // Error handling
    console.log('Error ----> ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
