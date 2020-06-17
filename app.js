const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

let campgrounds = [
		{name: "High Rise", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
		{name: "Divorce Mountain", image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
		{name: "AA Cabin", image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
		{name: "Witch's House", image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60g"},
		{name: "Liver River", image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
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
	let campImage= req.body.image; 
	let newCampground = {name: campName, image: campImage};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server initiated.");
});