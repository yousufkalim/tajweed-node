/**
 * User schema
 * @author Shuja Naqvi
 */
const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      minlength: 8,
    },
    number: {
      type: String,
    },
    otp: Number,
    whatsapp_number: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    age: Number,
    country: String,
    address: String,
    city: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("users", userSchema);
