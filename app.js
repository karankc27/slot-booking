const express=require('express');
const path=require('path');
const router=require('router');
const app=express();


const flash=require("connect-flash");

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));


const mongoose=require("mongoose");
const session=require("express-session");
const User=require("./models/user");
const MongoDBStore=require("connect-mongodb-session")(session);

const MONGODB_URI= "mongodb+srv://karankc27:Bipolar@cluster0.nqxcw.mongodb.net/test";
const store=new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
     })
  );
  
  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        next(new Error(err));
      });
  });
  app.use((req,res,next)=>{
    res.locals.successMessage=null;
    res.locals.errorMessage=null;
    res.locals.isLoggedIn=req.session.isLoggedIn;
    res.locals.errorMessage=false;
    if(req.session.isLoggedIn) {
      res.locals.name=req.session.user.name;
      res.locals.email=req.session.user.email;
      res.locals.id=req.session.user._id;
    }
    next();
  });
const routes=require('./routes/authRoutes');
app.use(flash());
app.use(routes);

mongoose.connect(MONGODB_URI).then(result=>{
    app.listen(process.env.PORT||3000);
  
  }).catch(error=>{
    console.log(error);
  });