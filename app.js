const express = require("express"),
	app = express(),
	request = require("request"),
 	bodyParser = require("body-parser"),
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

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp-camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(methodOverride("_method"));
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 

app.use(require("express-session")({
	secret: "Development has begun.",
	resave: false,
	saveUninitialized: false
}));

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