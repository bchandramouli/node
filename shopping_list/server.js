#!/usr/bin/env node --debug

var http = require("http");

var url = require("url");

var items = [];

function sanitizeUrl(req, res) {

	var path = url.parse(req.url).pathname;
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
			iObj.item += chunk;
	});
}


var server = http.createServer(function (req, res) {
	switch (req.method) {
		case "POST":
			var itemObj = {item: ""};
			processReq(req, itemObj);

			req.on("end", function () {
				var itm = itemObj.item;
				items.push(itm);
				res.end("Item Added: " + itm + "\n");
			});
			break;

		case "GET":
			items.forEach(function (item, i) {
				res.write(i+1 + ". " + item + "\r\n");
			});
			res.end();
			break;

		case "DELETE":
            var index = sanitizeUrl(req, res);
			if (index !== null) {
		    	res.end("Deleting item " + items[index] + " ...\n");
		    	items.splice(index, 1);
		    }
		    break;

		case "PUT":
			var index = sanitizeUrl(req, res);
			if (index !== null) {
				var itemObj = {item: ""};
				processReq(req, itemObj);

				req.on("end", function () {
					itm = itemObj.item;
					res.end("Updating Item from: " + items[index] + " to: " + itm + "\n");
					items[index] = itm;
				});
			}
			break;
	}
});

server.listen(8000, function() {
	console.log("listening on 8000");
});	
