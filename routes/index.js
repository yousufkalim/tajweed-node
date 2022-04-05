/**
 * All api routes handles here
 * @author Shuja Naqvi
 */
const router = require("express").Router();

// Parent Routes
router.use("/users", require("./users")); // All the user routes
router.use("/admins", require("./admins")); // All the user routes
router.use("/auth", require("./auth")); // All the auth routes
router.use("/student", require("./student")); // All the routes for regular student
router.use("/contacts", require("./contacts")); // All the routes for contact
router.use("/invoices", require("./invoices")); // All the routes for contact

// Export
module.exports = router;
