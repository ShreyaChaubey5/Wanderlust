const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listings=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
// const ExpressError=require("./utils/expressErrors.js");

const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(Mongo_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.get("/",(req,res)=> {
    res.send("hii I am root");
});

//Index route
app.get("/listings",async (req,res) => {
    const allListings = await Listings.find({});
    res.render("listings/index",{ allListings });
});

//NEW ROUTE 
app.get("/listings/new",(req,res) => {
    res.render("listings/new")
});

//create Route
app.post("/listings",wrapAsync(async (req,res) => {
   const newListing=new Listings(req.body.listing);
 await  newListing.save();
   res.redirect("/listings");
})
);

//show route
app.get("/listings/:id",async(req,res,next) => {
    try {
       let {id}=req.params;
       const listing = await Listings.findById(id);
       res.render("listings/show",{ listing });
    }
    catch(err){
       next(err);
    }
});


//Edit Route
app.get("/listings/:id/edit",async (req,res) => {
    let {id}=req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit",{ listing });
});

//update Route
app.put("/listings/:id",async(req,res) => {
    let {id}=req.params;
    await Listings.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//Delete Route 
app.delete("/listings/:id",async (req,res) => {
     let {id}=req.params;
    let deletedListing=await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});




// app.get("/testListing", async (req,res) => {
//     let sampleListing=new Listing({
//         title:"My Home",
//         description:"By the beach",
//         price:1200,
//         Location:"Goa",
//         Country:"India",
//     });
//    await sampleListing.save();
//     console.log("sample is saved");
//     res.send("successful");
    
// });
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});

//middleware
app.use((err,req,res,next) => {
    let{statusCode,message}=err;
    res.status(statusCode).send(message);
});



app.listen(8080,() =>{
    console.log("server is listening port 8080");
});