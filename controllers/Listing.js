const listing= require("../model/listing.js");


module.exports.index=async (req,res)=>{
    const allData= await listing.find({});
    
    res.render("index.ejs", {allData});
};

module.exports.renderNewForm = async(req,res)=>{
    res.render("new.ejs");
};

module.exports.showListings = async(req,res)=>{
    let {id}=req.params;
    const listings= await listing.findById(id).populate({path:"reviews" ,
         populate:{path:"author",}, //this is used to get the id of  author of the review
    }).populate("owner");
    if(!listings){
        req.flash("error", "List you requested is not found");  
        res.redirect("/listing");
    }
    res.render("show.ejs",{listings});
};

module.exports.createListing = async(req,res)=>{
    let url=req.file.path;
    let filename= req.file.filename;
    const newlisting= new listing(req.body.listing);
    newlisting.owner= req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success", "New List Added Sucessfully");
    res.redirect("/listing");
  
};

module.exports.editListing = async(req,res)=>{
    let {id}=req.params;
    const listings= await listing.findById(id);
    if(!listings){
        req.flash("error", "List you requested is not found");  
        res.redirect("/listing");
    }

    let originalImageUrl=listings.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("edit.ejs",{listings,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    let listings= await listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if (req.file){
    let url=req.file.path;
    let filename= req.file.filename;
    listings.image={url,filename};
    await listings.save();
    }
    req.flash("success", "List Updated Sucessfully");
    res.redirect(`/listing/${id}`) ; 
};

module.exports.deleteListing = async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted Sucessfully");
    res.redirect("/listing");
};

module.exports.searchlisting= async(req,res,next)=>{
    let {country}= req.body;
    
    let allData = await listing.find({country: country});
    if(allData){
       
        res.render("index.ejs", {allData});
    }else {
        req.flash("error", "We are not available in this country");
        res.redirect("/listing");
    }
}