const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const userSchema= new Schema({
  name:{
    type: String,
  },
  email:{
    type: String,
    required: true
  },
  sblock:{
    type: Number,
    required: true
  },
  registration_id:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },

});
module.exports=mongoose.model('User',userSchema);