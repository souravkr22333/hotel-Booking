const listing= require("../model/listing.js");
const Review= require("../model/reviews.js");
const mongoose= require("mongoose");

module.exports.ReviewView = async(req,res)=>{
    let count=0;
    let reviewCount=0;
    let {id}=req.params;
    const  listings= await listing.findById(id).populate("reviews");
    
    let newReview= new Review (req.body.review); // create new review
    newReview.author=req.user._id; //used to get the user id from the req object and assign it to the author field of the review
    listings.reviews.push(newReview);
    await newReview.save();
     await listings.save();

     for(let reviews of listings.reviews){
       if(reviews !== "undefined"||"null"){
        count++;
        reviewCount= reviewCount+ reviews.rating;   
       }
    }
    let avgReview=Math.round(reviewCount / count);
    listings.avgReview=avgReview;
    listings.totalReview=count;
    await listings.save();
    
    req.flash("success", "New Review Added Sucessfully");
    res.redirect(`/listing/${listings._id}`);
};

module.exports.ReviewDelete = async(req,res)=>{
    let {id,reviewid}=req.params;
     await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
     await Review.findByIdAndDelete(reviewid);
     req.flash("success", "Review Deleted Sucessfully");
     res.redirect(`/listing/${id}`);

};


