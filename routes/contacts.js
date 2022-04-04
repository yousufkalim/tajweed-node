/**
 * Contact CRUD routes
 * @author Arooj Ishfaq
 */
const router = require("express").Router();
const contacts = require("../controllers/contacts");

/**
 * ////////////////////////// Routes /////////////////////////
 * @method post contact post
 */

// Create - Contact
router.post("/", contacts.create);

// Export
module.exports = router;
