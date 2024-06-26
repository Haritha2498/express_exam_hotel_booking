const {Schema}=require('mongoose');
const {model}=require('mongoose');

const hotelschema=new Schema({
    room:{type:String,required:true},
    name:{type:String,required:true},
    entry:{type:String,required:true},
    exit:{type:String,required:true}

})


const hotelmodel=model("roomdetails",hotelschema);
module.exports=hotelmodel;