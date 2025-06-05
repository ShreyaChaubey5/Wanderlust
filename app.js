if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressErrors.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User= require("./models/user.js");
const LocalStrategy= require("passport-local");
const passport=require("passport");
const {isLoggedIn}=require("./middleware.js");
const cors = require("cors");

//const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store= MongoStore.create({
  mongoUrl:dbUrl,
   crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});
 
store.on("error",(err) => {
  console.log("error in mongo session",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge: 7*24*60*60*1000,
     httpOnly: true,  
  },
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//search
app.use(cors());

app.get("/api/search", (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.status(400).json({ message: "Missing search query" });
  }

  const results = listings.filter(listing =>
    listing.location.toLowerCase().includes(query) ||
    listing.country.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    return res.status(404).json({ message: "No results found." });
  }

  res.json(results);
});





//pbkdf2 hashing algo

app.use((req,res,next) => {
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews/",reviewRouter);
app.use("/",userRouter)

// FIXED: 404 handler - Use middleware instead of app.all("*")
app.use((req, res, next) => {
  const err = new ExpressError(404, "Page not found!");
  next(err);
});

//middleware
app.use((err,req,res,next) => {
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{ message });
    next();
});


app.listen(8080, () => {
  console.log("server is listening on port 8080");
});