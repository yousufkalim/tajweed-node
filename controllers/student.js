/**
 * Student CRUD controllers
 * @author Najam Ul Saqib
 */

const Student = require("../models/Student");
const Invoices=require("../models/Invoices")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenSecret = process.env.JWT_SECRET;
const { sendEmail } = require("../utils/sendEmail");

exports.create = async (req, res) => {
  try {
    let { email } = req.body;

    const existingUser = await Student.findOne({ email }); // Finding already existing user
    // Extra Validations
    if (existingUser) {
      // If we found existing user in db
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    req.body.password = bcrypt.hashSync(
      req.body.password,
      parseInt(bcryptSalt)
    )
     let start_date=new Date(req.body.start_date)
    let end_date=start_date.getTime()+2592000000;
    const student = await Student.create(req.body);
    const invoices=await Invoices.create({course:req.body.course_name,start_date:start_date,end_date:new Date(end_date),payment:"199",user:student._id})
    student.invoice.push(invoices._id)
    student.save()
    res.json({ success: true, student });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    //* get all students
    let students = await Student.find();
    res.json({ success: true, students });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    let { studentId } = req.params;
    let student = await Student.findById(studentId);
    if (!student) {
      return res.json({ success: false, msg: "No user found by this ID" });
    }
    res.json({ success: true, student });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    let { studentId } = req.params;

    const student = await Student.findByIdAndUpdate(studentId, req.body, {
      new: true,
    }); // Updating the user

    res.json({ success: true, student });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.delete = async (req, res) => {
  try {
    let { studentId } = req.params;
    await Student.findByIdAndDelete(studentId).then((resp, err) => {
      if (err) {
        throw err;
      } else {
        if (resp) {
          return res.json({ success: true, msg: "User deleted", resp });
        } else {
          return res.json({ success: false, msg: "User not found" });
        }
      }
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    // Getting email and password
    const { email, password } = req.body;

    // Getting student from db
    const student = await Student.findOne({ email });

    if (!student) {
      // If student not found
      console.log(student);
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Comparing password
    const isMatched = bcrypt.compareSync(password, student.password);

    if (!isMatched) {
      // If password not matched
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    // Creating payload with student object
    const payload = { student };

    // Generating token
    jwt.sign(payload, tokenSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;

      // done
      res.json({ success: true, student, token });
    });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.confirmAuth = async (req, res) => {
  // If user authenticated
  res.json({ success: true, user: req.student, token: req.token });
};

exports.changePassword = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are not same",
      });
    }

    let student = await Student.findById(studentId);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const isMatched = bcrypt.compareSync(oldPassword, student.password);

    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old Password" });
    }

    // Generate token
    student.password = bcrypt.hashSync(newPassword, parseInt(bcryptSalt));

    await student.save();

    res.json({ success: true, student });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.forgot = async (req, res) => {
  try {
    let { email } = req.params;
    let student = await Student.findOne({ email });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Generating random password
    let randomPassword = Math.random().toString(36).slice(-8);

    // Sending email to user
    sendEmail(email, randomPassword)
      .then(async () => {
        // If email is sent then we have to update the password in db
        student.password = await bcrypt.hash(
          randomPassword,
          parseInt(bcryptSalt)
        );
        await student.save();

        // Done
        res.json({ success: true, message: "Email sent successfully" });
      })
      .catch((err) => {
        // Error handling
        console.log("Error ----> ", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  } catch (err) {
    // Error handling
    console.log("Error ----> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
