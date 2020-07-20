const express = require("express"),
	  router = express.Router(),
      Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  Middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", Middleware.isLoggedIn, (req, res) => { //req comes before res
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", Middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/campgrounds/:id/comments/:comment_id/edit", Middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

router.put("/campgrounds/:id/comments/:comment_id", (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Updated comment.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id/comments/:comment_id", Middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function checkCommentOwnership(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, selectedComment) => {
		if(err) {
			console.log(err);
		} else {
			if(selectedComment.author.id.equals(req.user.id)) {
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
