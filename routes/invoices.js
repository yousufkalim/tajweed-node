/**
 * Invoice CRUD routes
 * @author Shuja Naqvi
 */
 const router = require("express").Router();
 const invoices = require("../controllers/invoices");
 

 
 /**
  * ////////////////////////// Routes /////////////////////////
  * @method post Create Invoice
  * @method get get all Invoices
  * @method get get invoice by id
  * @method put update invoice
  */
 
 // Get - Invoices By UserId
 router.get("/:userId", invoices.getById);

 // Export
 module.exports = router;
 