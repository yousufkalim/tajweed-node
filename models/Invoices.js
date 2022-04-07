/**
 * Invoice schema
 * @author Shuja Naqvi dev
 */
 const { mongoose,Schema, model } = require("mongoose");

 // Schema
 const invoiceSchema = Schema(
   {
    course: {
       type: String,
     },
     start_date:Date,
     end_date:Date,
     status:{
         type:String,
         enum:["pending","paid"],
         default:"pending"
     },
     payment:String,
     user:{
        type: Schema.Types.ObjectId,
         ref: "students" 
     }
   },
   {
     timestamps: true,
   }
 );
 
 // Model
 module.exports = model("invoices", invoiceSchema);
 