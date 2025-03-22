const { types } = require("joi");
const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const imageschema=new Schema({
   url:{
    types:String,
   },
   filename:{
    types:String,
   },
    
});



module.exports=mongoose.model("img", imageschema);