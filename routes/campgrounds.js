const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  Middleware = require("../middleware");

router.get("/campgrounds/new", Middleware.isLoggedIn, (req, res) => {
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
		
router.post("/campgrounds", Middleware.isLoggedIn, (req, res) => {
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
			createdCampground.save();
			req.flash("success", "Campground added.");
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
				res.render("campgrounds/show", {campgrounds: foundCampground, currentUser: req.user});
			}
							});
		});

router.get("/campgrounds/:id/edit", Middleware.checkCampgroundOwnership, (req, res) => {
		Campground.findById(req.params.id, (err, selectedCampground) => {
			res.render("campgrounds/edit", {campground: selectedCampground});
	});
});
			

router.put("/campgrounds/:id", Middleware.checkCampgroundOwnership, (req, res) => {
	let data = req.body.campground;
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground updated.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id", Middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds/:id");
		} else {
			req.flash("success", "Campground deleted.");
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

module.exports = router;