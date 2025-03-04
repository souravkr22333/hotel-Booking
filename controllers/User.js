
const user=require("../model/user.js");

module.exports.RenderSignupForm= (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try{
        const {username,email,password}=req.body;
        const newUser=new user({email,username});
        const registeruser= await user.register(newUser,password);
        //after signup directly login
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Signup Successfully");
            res.redirect("/listing");
        });
        
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/signup");
    }
   
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login =   async(req,res,next)=>{
    req.flash("success", "Login Successfully");
    const redirectUrl= res.locals.redirectUrl || "/listing";  //req.session.redirectUtl it contain the url of previous page
    res.redirect(redirectUrl); 
 };

 module.exports.Logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out Successfully");
        res.redirect("/listing");
    });
};