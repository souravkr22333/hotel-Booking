const mongoose= require("mongoose");
const Schema= mongoose.Schema;

let listingschema= new Schema ({
    title:{
        type:String,
       
    },
    description:String,
    image:{
        type:String,
        set:(v)=> v===""? "default link" :v
    },
    price:Number,
    location: String,
    country:String,
})

const listing= mongoose.model("listing", listingschema);

module.exports= listing;

