#!/usr/bin/env node --debug

var express = require("express"),
    port = 8000, 
    expressHbs = require("express-handlebars");
 
var app = express();
var hbs = expressHbs.create({extName:"Hbs", delfaultLayout: "main.hbs"});

app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");

app.get("/:name", function (req, res) {
	res.render("greeting", { title: "Simple Greeting App", name: req.params.name });
});

app.listen(port, function () {
	console.log("Listening on port: ", port);
});