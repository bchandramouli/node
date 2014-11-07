#!/usr/bin/env node --debug

var http = require("http");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");

var items = [];

var root = __dirname;

console.log("root = ", root);

var server = http.createServer(function (req, res) {

	var url = parse(req.url);
	var path = join(root, url.pathname);
	fs.stat(path, function (err, stat) {
		if (err) {
			if (err.code == "ENOENT")

		}

	});
	var stream = fs.createReadStream(path);

	stream.pipe(res);

	stream.on("error", function (err) {
		res.statusCode = 500;
		res.end("Internal Server Error");
	});
});

server.listen(8000, function() {
	console.log("listening on 8000");
});	