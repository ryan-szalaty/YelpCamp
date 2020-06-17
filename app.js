const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

let campgrounds = [
		{name: "High Rise", image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
		{name: "Divorce Mountain", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
		{name: "AA Cabin", image: "https://pixabay.com/get/54e5dc474355a914f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
		{name: "Witch's House", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"},
		{name: "Liver River", image: "https://pixabay.com/get/52e3d5404957a514f1dc84609620367d1c3ed9e04e507440772d7ad49e4ac0_340.jpg"}
	];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //allows removal of .ejs from .render

app.get("/", (req, res) => {
	res.render("landingPage");
});

app.get("/campgrounds/new", (req, res) => {
	res.render("form.ejs");
});

app.get("/campgrounds", (req, res) => {
	res.render("campgroundsPage", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
	let campName= req.body.name; //comes from name attribute
	let campImage= req.body.image; //comes from name attribute
	let newCampground = {name: campName, image: campImage};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server initiated.");
});