const express= require("express");
const router=express.Router({mergeParams: true});
const listing= require("../model/listing.js");
const Expresserror=require("../util/Expresserror.js");
const WrapAsync=require("../util/WrapAsync.js");
const Review= require("../model/reviews.js");
const{ reviewschema, listingschems} = require("../schema.js");
const joi=require ("joi");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const Reviewcontroller= require("../controllers/Review.js");




//reviews
router.post("/reviews",validateReview,isLoggedIn, WrapAsync(Reviewcontroller.ReviewView));

//delete review

router.delete("/reviews/:reviewid" ,isLoggedIn,isReviewAuthor,WrapAsync(Reviewcontroller.ReviewDelete));

module.exports= router;