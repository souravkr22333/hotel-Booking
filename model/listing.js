const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const review=require("./reviews.js");


//listing schema
let listingschema= new Schema ({
    title:{
        type:String,
       
    },
    description:String,
    
    image:[{
       url:String,
       filename:String,
    // type: Schema.Types.ObjectId,
    // ref: "img",
    }],

    price:Number,

    location: String,

    country:{
        type:String,       
    },
       
    

    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",

    },],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
});

// medelware for deleting review objectid from listing
listingschema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
   
})

const listing= mongoose.model("listing", listingschema);

module.exports= listing;
