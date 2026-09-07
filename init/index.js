require("dotenv").config();

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main()

.then(() =>{

    console.log("connected to DB");

    initDB();

})

.catch((err) =>{

    console.log(err);

});

async function main(){

    await mongoose.connect(MONGO_URL);

}

const initDB = async() =>{

    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) =>({ ...obj, 

        owner: new mongoose.Types.ObjectId('6a9e75e0d9220a6cd074be96')

    }));

    await Listing.insertMany(initData.data);

    console.log("data was initialized");

};