const Contacts = require("../models/Contacts");

exports.create = async (req, res) => {
  try {
    const contact = await Contacts.create(req.body);

    res.json({
      success: true,
      message: "Your message submitted successfully",
      contact,
    });
  } catch (err) {
    console.log("Error ---> ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
