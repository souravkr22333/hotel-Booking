const mongoose= require("mongoose");
const Schema= mongoose.Schema;


//review schema
let reviewSchema= new Schema ({
    comment:{
        type : String,

    },

    rating:{
        type: Number,
        min: 1,
        max: 5,
    },

    createdAt :{
        type: Date,
        default: Date.now(),
    },

    author:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
})



module.exports= mongoose.model("Review", reviewSchema);