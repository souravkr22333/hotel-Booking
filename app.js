if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const mongoose= require("mongoose");
const express= require("express");
const app= express();
const path= require("path");
//for using delete and put methods
const methodOverride= require("method-override");
// for connecting ejs page
const engine=require("ejs-mate");
// for expresserror middleware
const Expresserror=require("./util/Expresserror.js");
// review and listing schema
const listing= require("./model/listing.js");
const Review = require("./model/reviews.js");
// for joi schema of review and listing
const{listingschema , reviewschema} = require("./schema.js");
//for listing and review router model
const listingsRouter=require("./Routers/listings.js");
const reviewsRouter=require("./Routers/review.js");
const userRouter=require("./Routers/user.js");
// for session and flash
const session= require("express-session");
const mongoStore= require("connect-mongo");
const flash=require("connect-flash");
// for password
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

// mongoose connection using express
const dburl=process.env.ATLASDB_URL;

Main().then(()=>{
    console.log("connected to data base");
})
.catch(e=>{
    console.log(e);
});

async function Main (){
    await mongoose.connect(dburl);
};

//session setup and set cookie timeout 

const store= mongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60 ,// 1 day
})

store.on("error",()=>{
    console.log("error in session store",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET, 
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000*60*60*24*7, // 7 days
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
};



// session and flash code
app.use(session(sessionOption));
app.use(flash());

// passpors authrntication code
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("local", {session: false}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));

//  flash code for error and success
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");  //save flash success message to locals
    res.locals.error=req.flash("error");  //save flash error message to locals
    res.locals.currentUser=req.user;    //save current user info to locals
    next();
})

// router of listing and review code
app.use("/listing" , listingsRouter);
app.use("/listing/:id", reviewsRouter);
app.use("/", userRouter);

// if any route is not found then send 404 error
app.all("*",(req,res,next)=>{
    
   next(new Expresserror (405,"Page not Found"));
});

// for error handling
app.use((err,req,res,next)=>{
 let{statuscode=500,message="Something Wrong"}=err;
 res.status(statuscode).render("error.ejs",{message});
 
});

app.listen(8080,()=>{
    console.log(`request accepted on port 8080 `);
});