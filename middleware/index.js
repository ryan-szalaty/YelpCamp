const middlewareObj = {},
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, selectedCampground) => {
		if(err) {
			req.flash("error", "Campground not found.");
		} else {
			if(selectedCampground.author.id.equals(req.user._id)) {
				next();
			}
			else {
				req.flash("Permission denied.");
				res.redirect("back");
			}
		}
	});
	} else {
		req.flash("error", "Log in to proceed.");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, selectedComment) => {
		if(err) {
			console.log(err);
		} else {
			if(selectedComment.author.id.equals(req.user.id)) {
				next();
			}
			else {
				req.flash("error", "Permission denied.");
				res.redirect("back");
			}
		}
	});
	} else {
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please sign in first.");
	res.redirect("/login");
}


module.exports = middlewareObj;