const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
	{
	name: "Divorce Mountain",
	image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "Daddy is still out buying the milk."
	},
	{
	name: "Bachelor Pad",
	image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "Life is simpler when you're single."
	},
	{
	name: "The Man Cave",
	image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "What more needs to be said?"
	}
]

function seedDB() {
	Campground.deleteMany({}, (err) => {
	if(err) {
		console.log(err);
	}
	console.log("Campground removed.");
			data.forEach(function(seed) {
			Campground.create(seed, (err, data) => {
			if(err) {
				console.log(err);
			} else {
				console.log("Added: " + data);
				Comment.create(
					{
						text: "This place is great, but no internet.",
						author: "Homer"
					}, (err, comment) => {
						if(err) {
							console.log(err);
						} else {
							data.comments.push(comment);
							comment.save();
						}
					}
				);
			}
		});
	});
	});
};



module.exports = seedDB;
