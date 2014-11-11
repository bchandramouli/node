#!/usr/bin/env node --debug

var http = require("http");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");
var qs = require("querystring");

var items = [];

var root = __dirname;

console.log("root = ", root);

var server = http.createServer(function (req, res) {

	if (req.url == "/") {
		switch(req.method) {
		  case 'GET':
		  console.log("in get");
			req.url = "/index.html";
			break;
		  case "POST":
			var item = "";
			req.setEncoding("Utf8");
			req.on("data", function(chunk) {
				item += chunk;
			});
			req.on("end", function() {
				var obj = qs.parse(item);
				console.log(obj);
				res.end("The item: \"" + obj.item + "\" was added successfully");

			});
			break;
		}
	}

	var url = parse(req.url);
	var path = join(root, url.pathname);
	fs.stat(path, function (err, stat) {
		if (err) {
			if (err.code === "ENOENT") {
				res.statusCode = 404;
				res.end("File not found");
			} else {
				res.statusCode = 500;
				res.end("Internal Server Error");
			}
		} else {
			var stream = fs.createReadStream(path);
			stream.pipe(res);
			stream.on("error", function (err) {
				res.statusCode = 500;
				res.end("Internal Server Error");
			});
		}
	});
});

server.listen(8000, function() {
	console.log("listening on 8000");
});	