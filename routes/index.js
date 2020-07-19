const express = require("express"),
	  router = express.Router(),
	  flash = require("connect-flash"),
	  passport = require("passport"),
	  User = require("../models/user");

router.get("/", (req, res) => {
	res.render("landingPage");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome, " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), (req, res) => {
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged out successfully.");
	res.redirect("/campgrounds");
});

module.exports = router;