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
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // required: true,
      minlength: 8,
    },
    number: {
      type: String,
    },
    whatsapp_number: {
      type: String,
    },
    otp: {
      type: String,
      minlength: 6,
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
