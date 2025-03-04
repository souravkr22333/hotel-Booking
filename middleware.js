const listing= require("./model/listing.js");
const Expresserror=require("./util/Expresserror.js");
const{listingschema ,reviewschema} = require("./schema.js");
const Review = require("./model/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; //accessing the url of current page
        // console.log (req.session.redirectUrl);
        req.flash("error", "You need to loggedin ");
        return res.redirect('/login');
        }
        next();
};

//save url of current page in session in locals
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if( !Listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
      
    }
    next();
};

module.exports. validateReview =(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errMsg);
    }else {
      next();  
    }
};

module.exports.validateListing =(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errMsg);
    }else {
      next();  
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if( !review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listing/${id}`);
      
    }
    next();
}