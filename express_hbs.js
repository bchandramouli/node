#!/usr/bin/env node --debug

var express = require("express"), port = 8000;
var app = express();

var expressHbs = require("express-handlebars");

app.engine('hbs', expressHbs({extName: "Hbs", defaultLayout: "main.hbs"}));
app.set("view engine", "hbs");

app.get("/:name", function (req, res) {
	res.render("greeting", { title: "Simple Greeting App", name: req.params.name });
});

app.listen(port, function () {
	console.log("Listening on port: ", port);
});