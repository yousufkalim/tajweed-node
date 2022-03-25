/**
 * Student schema
 * @author Najam Ul Saqib
 */
const mongoose = require("mongoose");

// Schema
const studentSchema = new mongoose.Schema(
  {
    first_name: {
      required: true,
      type: String,
    },
    last_name: {
      required: true,
      type: String,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    age: {
      type: Number,
      required: true,
    },
    city: {
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
    country: {
      required: true,
      type: String,
    },
    whatsapp_number: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    father_name: String,
    father_phone_number: String,
    mother_name: String,
    mother_phone_number: String,
    course: String,
    starting: String,
    language: String,
    skype_id: String,
    zoom_id: String,
  },
  {
    timestamps: true,
  }
);

// Model
module.exports = mongoose.model("student", studentSchema);
