const mongoose=require('mongoose');
const initData=require ('./data.js');
const Listing=require('../models/listing.js');


const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log('mongodb is connected');
}).catch((err)=>{
    console.log(err);
})


const initDB=async()=>{
   await Listing.deleteMany({});
  const modifiedData= initData.data.map((obj)=>({...obj,owner:"67cef3d315b93fb3067ca5fa"}));
   await Listing.insertMany(modifiedData);
   console.log("data was initilaised");
}

initDB();