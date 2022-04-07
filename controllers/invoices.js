/**
 * Invoices CRUD controllers
 * @author Shuja Naqvi
 */

 const Invoice = require("../models/Invoices");

 
 exports.create = async (req, res) => {
   try {
     let { user } = req.body;
 
     const existingUser = await Student.findById({ user }); // Finding already existing user
     // Extra Validations
     if (!existingUser) {
       // If we found existing user in db
       return res
         .status(409)
         .json({ success: false, message: "User Not Found." });
     }
    
     const student = await Student.create(req.body);
 
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
     let { userId } = req.params;
     console.log(userId)
     let invoices = await Invoice.find({user:userId});
     if (invoices.length<1) {
       return res.json({ success: false, msg: "No Invoice exist" });
     }
     res.json({ success: true, invoices });
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
 