const express=require('express');
const router=express.Router();
const User=require("../models/user");
const Bookings=require("../models/bookings");
const crypto=require("crypto");
const bcrypt=require("bcryptjs");
const bookings = require('../models/bookings');

//const authController=require("../controllers/authController");

router.get('/signup', (req,res)=>{
    res.render("signup",{
        isLoggedIn:false
    });
});


router.post('/signup',(req,res)=>{
  const email=req.body.email;
  const name=req.body.name;
  const registration_id=req.body.registration_id;
  const block=req.body.block;
  const password=req.body.password;
  //  console.log(email+" "+name+registration_id+block+password);
  crypto.randomBytes(32, (err, buffer) => {
      //console.log(err+" "+buffer);
    const token = buffer.toString('hex');
    //console.log(token);
    User.findOne({ email:email })
    .then(userDoc => {
     if (userDoc) {
        
        res.render('signup',{
         errorMessage:'User already exists, please go to login or signup with a different email.',
         title: 'Register',
       });
     }
     return bcrypt.hash(password, 12);
   })

   .then(hashedPassword => {
    console.log(hashedPassword); 
    const user= new User({
       email:  email,
       password: hashedPassword,
       name: name,
       sblock: block,
       registration_id:registration_id,
     });
 user.save()
 .then(result => {
       console.log(result);
       res.render('login',{
       successMessage: "The email has been registered Successfully!!",
       title: "Login",
       isLoggedIn:false
       });
     });
})
})
})



router.get("/login",(req,res)=>{
    res.render("login");
})


router.post("/login",(req,res)=>{
  const email=req.body.email;
  const password=req.body.password;
  console.log(email);
  var all_bookings;
  Bookings.find({})
    .sort({
      date: "descending"
    })
    .exec()
    .then(function(results) {
        all_bookings=results;    
    });
  User.findOne({email: email})
  .then(user => {
    if(!user){
      console.log("Email Not Registered");
      return res.render("signup",{
        errorMessage: "Email Not Registered",
        title: 'SignUp'
      });
    }
    bcrypt.compare(password, user.password)
    .then(doMatch =>{
      if(doMatch){
        req.session.isLoggedIn=true;
        req.session.user=user;
        return req.session.save(err =>{
          
          console.log("Logged In");
          return res.render("home",{
              successMessage:"Login Successfull!",
              isLoggedIn:true,
              bookings: all_bookings
          });

        });

      }

      return res.render("login",{
        errorMessage:"Incorrect Password",
        title: 'Login'
      //  oldemail: email
      });

    })
    .catch(err =>{
      console.log(err);
      res.render("/login");
    })
  })

})



router.get("/logout",(req,res)=>{
    //provided by session package to delete the session
    req.session.destroy(err =>{
      console.log(err);
      res.redirect("/login");
    });
});


router.get("/home",(req,res)=>{
    let all_bookings;
    let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    Bookings.find({})
    .sort({
      date: "descending"
    })
    .exec()
    .then(function(results) {
        all_bookings=results;    
        res.render("home",{
            bookings: all_bookings,
            errorMessage: message
        });
    });
})


router.get("/",(req,res)=>{
    let all_bookings;
    let message = req.query.message;
    var success,error;
    if (message!=null) {
      if(message=='error')error="The slot is already booked. Please select another date/time.";
      else success="Your booking has been confirmed!";
    } else {
      message = null;
    }
    Bookings.find({})
.sort({
  date: "descending"
})
.exec()
.then(function(results) {
    all_bookings=results;
    
    res.render("home",{
        bookings:results,
        errorMessage: error,
        successMessage: success
    });
});

})

router.post("/book",(req,res)=>{
    var date=req.body.date;
    var updated_bookings;
    const time=req.body.time;
    const facility=req.body.facility;
    console.log(time+" "+date);
    Bookings.findOne({$and:[{facility:facility, date:date, time:time}]})
    .then(booking=>{
        if(booking){
            req.flash('error', 'The slot is already booked. Please select another date/time.');
            return res.redirect("/?message=error");
            
        }
            const new_booking=new Bookings({
                facility:facility,
                time: time,
                date: date
            });
            new_booking.save();
            Bookings.find({})
            .sort({
              date: "descending"
            })
            .exec()
            .then(function(results) {
                all_bookings=results;
                req.flash('success', 'Your booking has been confirmed!');
                res.redirect("/?message=success");
                
        });
        }
    )
})
module.exports=router;