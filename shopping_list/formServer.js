#!/usr/bin/env node --debug

var http = require("http");
var pase = require("url").parse;
var join = require("path").join;
var fs = require("fs");
var qs = require("querystring");

var items = ["milk", "eggs", "potatoes"];

var root = __dirname;

console.log("root = ", root);

var indexBuff = "";

var indexPath = root+"/index.html";

fs.readFile(indexPath, "utf8", function (err, data) {
	if (err) {
		console.log(err);
	}
	indexBuff += data;
	console.log("index buffer = ", indexBuff);
});

var itemObj = {
	item: "",

	addChunk: function (chunk) {
		this.item += chunk;
	},

	getItem: function () {
		return (this.item);
	}
};

function sanitizeUrl(req, res) {

	var path = parse(req.url).pathname;
	var index = parseInt(path.slice(1), 10);
	index--; // Make it zero offset

	if (isNaN(index)) {
		res.statusCode = 400;
    	res.write("Invalid Index\n");
    	return (null);
    } else if (!items[index]) {
    	res.statusCode = 404;
    	res.write("Item not found\n");
    	return (null);
    }
	return (index);
}

function processReq(req, iObj) {
	req.setEncoding("utf8");
	req.on("data", function (chunk) {
		iObj.addChunk(chunk);
	});
}

var server = http.createServer(function (req, res) {
	switch (req.method) {
		case "POST":
			var postObj = Object.create(itemObj);
			processReq(req, postObj);

			req.on("end", function () {
				var itm = postObj.getItem();
				items.push(itm);
				res.end("Item Added: " + itm + "\n");
			});
			break;

		case "GET":
			console.log("in get");
		    var tBuff = "<p>";
			items.forEach(function (item, i) {
				tBuff += i+1 + ". " + item + "<br>";
			});
			tBuff += "</p>";
			var output_buff = indexBuff.replace("<placeholder>", tBuff);
			console.log(output_buff);
			res.end(output_buff);
			break;

		case "DELETE":
            var dIdx = sanitizeUrl(req, res);
			if (dIdx !== null) {
		    	res.end("Deleting item " + items[dIdx] + " ...\n");
		    	items.splice(dIdx, 1);
		    }
		    break;

		case "PUT":
			var pIdx = sanitizeUrl(req, res);
			if (pIdx !== null) {
				var putObj = Object.create(itemObj);
				processReq(req, putObj);

				req.on("end", function () {
					itm = putObj.getItem;
					res.end("Updating Item from: " + items[pIdx] + " to: " + itm + "\n");
					items[pIdx] = itm;
				});
			}
			break;
	}
});

server.listen(8000, function() {
	console.log("listening on 8000");
});	