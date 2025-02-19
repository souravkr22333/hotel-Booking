const mongoose= require("mongoose");
const initdata= require("./data.js");
const listing= require("../model/listing.js");


main().then(()=>{
    console.log("connection created");
}).catch((e)=>{
    console.log(e);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const initdb= async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("data inserted successfull");
};

initdb();