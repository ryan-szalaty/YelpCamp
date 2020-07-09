const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment");

router.get("/campgrounds/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/form");
});

router.get("/campgrounds", (req, res) => {
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		};
					});
});
		
router.post("/campgrounds", isLoggedIn, (req, res) => {
	let campName= req.body.name; //comes from name attribute
	let campImage= req.body.image; 
	let campDesc= req.body.description;
	let author = {
		id: req.user._id,
		username:  req.user.username
	}
	let newCampground = {name: campName, image: campImage, description: campDesc, author: author};
	Campground.create(newCampground, (err, createdCampground) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		};
		
	});

});

router.get("/campgrounds/:id", (req, res) => {
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

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;