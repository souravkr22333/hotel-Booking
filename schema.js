const joi=require ("joi");

module.exports.listingschema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description: joi.string().required(),
        location:joi.string().required(),
        // pincode:joi.number().required(),
        image:joi.string().allow("",null),
        price: joi.number().required().min(0),
        country: joi.string().required(), 
        review:joi.string()  
    }).required(),
});

module.exports.reviewschema= joi.object({
    review:joi.object({
    rating: joi.number().required().min(1).max(5),
    comment:joi.string().required(),
    }).required(),
     
});