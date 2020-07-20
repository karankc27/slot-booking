const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const bookingSchema= new Schema({
  facility:{
    type: String,
    required: true
  },
  date:{
    type:Date,
  },
  time:{
    type:String
  }
});
module.exports=mongoose.model('Bookings',bookingSchema);