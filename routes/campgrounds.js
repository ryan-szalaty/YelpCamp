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

router.get("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res) => {
		Campground.findById(req.params.id, (err, selectedCampground) => {
			res.render("campgrounds/edit", {campground: selectedCampground});
	});
});
			

router.put("/campgrounds/:id", checkCampgroundOwnership, (req, res) => {
	let data = req.body.campground;
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds/:id");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function checkCampgroundOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, selectedCampground) => {
		if(err) {
			console.log(err);
		} else {
			if(selectedCampground.author.id.equals(req.user._id)) {
				next();
			}
			else {
				res.redirect("back");
			}
		}
	});
	} else {
		res.redirect("/login");
	}
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;