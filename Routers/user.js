const express= require("express");
const router=express.Router();
const user=require("../model/user.js");
const WrapAsync = require("../util/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/User.js")

//signup page route
// render signup page .get and signup .post
router.route("/signup")
    .get(userController.RenderSignupForm)
    .post( WrapAsync(userController.signup))

//login page route 

router.route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl,   //saveredirect is used for rediecting to previous page after login
        passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.Login)


//loged out route

router.get("/logout",userController.Logout)



module.exports=router;