const express= require("express");
const router=express.Router();
const listing= require("../model/listing.js");
const Review= require("../model/reviews.js");
const WrapAsync = require("../util/WrapAsync.js");
const Expresserror=require("../util/Expresserror.js");
const{listingschema ,reviewschema} = require("../schema.js");
const joi=require ("joi");
const { isLoggedIn ,isOwner} = require("../middleware.js");
const {validateListing } = require("../middleware.js");
const listingController=require("../controllers/Listing.js");
const multer= require("multer");
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage });

//index route .get and create route .post
router.route("/")
    .get( WrapAsync(listingController.index))
    .post(isLoggedIn,upload.array("listing[image]") ,  validateListing,WrapAsync(listingController.createListing))  
 
//new route
router.get("/new",isLoggedIn, WrapAsync(listingController.renderNewForm));

//show route .get and update route .put  and delete route .delete
router.route("/:id")
.get( WrapAsync(listingController.showListings))
.put(isLoggedIn,upload.single("listing[image]") ,isOwner,validateListing, WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, WrapAsync(listingController.deleteListing))

//edit rout
router.get("/:id/edit",isLoggedIn,isOwner, WrapAsync(listingController.editListing));

router.post("/search",listingController.searchlisting);

module.exports=router;