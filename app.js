const express = require('express');
const app = express();
const port=3010;
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


const dotenv=require('dotenv')
dotenv.config();


const mongoose=require('mongoose');
const url=process.env.mongodb_url;
mongoose.connect(
    url
)

const database=mongoose.connection;
database.on("error",(error)=>
{
    console.log(error)
});
database.once("connected",()=>
{
    console.log("database connected");
})
const hoteldb=require('./models/schema.js')



app.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.get('/add',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','add.html'))
})

app.get('/view',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','view.html'))
    
})

app.get('/update',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','update.html'))
})


app.get('/search',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','search.html'))
})

app.get('/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','add.html'))
})


app.post('/add',async(req,res)=>
{
    try{
    var{room,name,entry,exit}=req.body;
    room=parseInt(room)
    const newroom={room,name,entry,exit};
    const data=await hoteldb.create(newroom);
    console.log(data);
    console.log('added')
    res.redirect('/view')
    }
    catch(error){
        console.log(error)
    }
})


app.get('/view/data',async (req,res)=>{
    try{
    const data=await hoteldb.find();
    res.json(data)
    
}
catch(error){
    console.log(error)
}
})

app.get('/search/:id',(req,res)=>
{
    const id=req.params.id;
    res.sendFile(path.join(__dirname,'public','search.html'))

})

app.get('/search/data/:id', async(req, res) => {
    try{
    const eid = req.params.id;
    
    const data=await hoteldb.findOne({room:eid})
    res.json(data);
}
catch(error){
    console.log(error)
}
}
);

app.get('/update/:id',async(req,res)=>
{
 const eid=req.params.id;
const details=await hoteldb.findOne({room:eid})
console.log(details)

    res.sendFile(path.join(__dirname,'public','update.html'))
    
})

app.post('/update/data/:id',async(req,res)=>
{
    try{
    let {room,name,entry,exit}=req.body;
    
    const update={room,name,entry,exit}
    let reqroom=req.params.id;
    reqroom=reqroom.toString();
    const options = { new: true };
    console.log("hello");
    
    const updateddetails=await hoteldb.findOneAndUpdate({room:reqroom},update,options);
    
    res.redirect('/view')
}
catch(error){
    console.log(error);
    res.status(500).json({ message: error.message });
}

})


app.post('/delete/:id', async(req, res) => {
    try{
    const id = req.params.id;
    console.log("helo")
    const deletedDetails = await hoteldb.findOneAndDelete({room:id});

    res.redirect('/view');
}
catch(error){
    console.log(error)
}
});


app.get('/searchday/:id',(req,res)=>
{
    const id=req.params.id;
    res.sendFile(path.join(__dirname,'public','viewday.html'))

})

app.get('/viewday/data/:id',async (req,res)=>{
    try{
        const eid = req.params.id;
        const data=await hoteldb.find({entry:eid});
        res.json(data)
    
}
catch(error){
    console.log(error)
}
})


app.listen(port,(req,res)=>
{
    console.log("service is running on port:"+port)
})