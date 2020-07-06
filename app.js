const express = require("express"),
	app = express(),
	request = require("request"),
 	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds"),
	Comment = require("./models/comment");

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp-camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 

app.get("/", (req, res) => {
	res.render("landingPage");
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/form");
});

app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		};
					});
});
		
app.post("/campgrounds", (req, res) => {
	let campName= req.body.name; //comes from name attribute
	let campImage= req.body.image; 
	let campDesc= req.body.description;
	let newCampground = {name: campName, image: campImage, description: campDesc};
	Campground.create(newCampground, (err, createdCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		};
		
	});

});

app.get("/campgrounds/:id", (req, res) => {
		let id = req.params.id;
		Campground.findById(id).populate("comments").exec(function(err, foundCampground) { //puts comments in there
			if(err) {
				console.log(err);
			} else {
				console.log(foundCampground);
				res.render("campgrounds/show", {campgrounds: foundCampground});
			}
							});
		});

//===========================
//COMMENTS ROUTES
//===========================

app.get("/campgrounds/:id/comments/new", (req, res) => { //req comes before res
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server initiated.");
});