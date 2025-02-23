const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch(err =>{
        console.log(err);
    });



async function main(){
     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
};

let arr = [ "trending" , "topcities" ,"artic" ,"mountains" ,"countryside" ,"farms" ,"beach" ];
let initialize_data = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
        ...obj,
        owner : "67b1ddf9e2ce8b58f8e3ba60",
        tag : arr[Math.floor(Math.random() * arr.length)]
    }));
    await Listing.insertMany(initData.data);
}

// initialize_data();