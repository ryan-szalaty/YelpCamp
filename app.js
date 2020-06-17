const express = require("express"),
	app = express(),
	request = require("request"),
 	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Schema setup

let campgroundSchema = new mongoose.Schema({ 
	name: String,
	image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

/*
Campground.create({name: "Divorce Mountain", 
				   image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}, (err, campground) => {
				  
	if(err) {
		console.log("ERROR.");
	} else {
		console.log("Successfully added.");
		console.log(campground);
	};
				  });
*/

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //allows removal of .ejs from .render

app.get("/", (req, res) => {
	res.render("landingPage");
});

app.get("/campgrounds/new", (req, res) => {
	res.render("form");
});

app.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			console.log("Successfully found: " + allCampgrounds);
			res.render("campgroundsPage", {campgrounds: allCampgrounds});
		};
					});
});
		
app.post("/campgrounds", (req, res) => {
	let campName= req.body.name; //comes from name attribute
	let campImage= req.body.image; 
	let newCampground = {name: campName, image: campImage};
	Campground.create(newCampground, (err, createdCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		};
		
	});

});


app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server initiated.");
});