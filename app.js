const express = require("express"),
	app = express(),
	request = require("request"),
 	bodyParser = require("body-parser"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	User = require("./models/user"),
	seedDB = require("./seeds"),
	Comment = require("./models/comment");
/////////////////////////////////////////////////////////////////////////
const campgroundsRoutes = require("./routes/campgrounds"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index");

//seedDB();
mongoose.connect("mongodb+srv://dbRyan:dbYelpCamp1@cluster0.wpgkp.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
//"mongodb+srv://dbRyan:dbYelpCamp1@cluster0.wpgkp.mongodb.net/yelp_camp?retryWrites=true&w=majority"
//"mongodb://localhost:27017/yelp-camp"
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(flash());

app.use(require("express-session")({
	secret: "Development has begun.",
	resave: false,
	saveUninitialized: false
}));

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(campgroundsRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
/////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server initiated.");
});