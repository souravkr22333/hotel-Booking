const mongoose= require("mongoose");
const express= require("express");
const app= express();
const listing= require("./model/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const engine=require("ejs-mate");
const Expresserror=require("./util/Expresserror.js");
const WrapAsync=require("./util/WrapAsync.js")



Main().then(()=>{
    console.log("connected to data base");
})
.catch(e=>{
    console.log(e);
})



async function Main (){
    await mongoose.connect('mongodb://127.0.0.1:27017/test');

}
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));


//shwo list rout
app.get("/listing", WrapAsync(async (req,res)=>{
    const allData= await listing.find({});
    res.render("index.ejs", {allData});
}));

//new route
app.get("/listing/new", WrapAsync(async(req,res)=>{
    res.render("new.ejs");
}));

//show rout
app.get("/listing/:id", WrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listings= await listing.findById(id);
    res.render("show.ejs",{listings});
}));

//create rout
app.post("/listing", WrapAsync(async(req,res,next)=>{
    try{
        const newlisting= new listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listing");
    } catch(err){
        next(err);
    }
       
  
    }));

//edit rout
app.get("/listing/:id/edit", WrapAsync( async(req,res)=>{
    let {id}=req.params;
    const listings= await listing.findById(id);
    res.render("edit.ejs",{listings});
}));


//updatr rout
app.put("/listing/:id", WrapAsync( async(req,res)=>{
    let {id}=req.params;
    
    await listing.findByIdAndUpdate(id,{ ...req.body.listing});
    res.redirect(`/listing/${id}`) ; 
}));

//delete rout
app.delete("/listing/:id", WrapAsync( async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

app.get("/",(req,res)=>{
    res.send("server working");
})

app.all("*",(req,res,next)=>{
    
   next(new Expresserror (405,"Page not Found"));
});

app.use((err,req,res,next)=>{
 let{statuscode=500,message="Something Wrong"}=err;
 res.status(statuscode).render("error.ejs",{message});
 
})

app.listen(8080,()=>{
    console.log(`request accepted on port 8080 `);
})