#!/usr/bin/env node --debug

var express = require('express'), port = 8000;
var bAuth = require('basic-auth');

var app = express();

/*
function helloMidWare(req, res, next) {
  console.log('hello from the middleware!');
  next();
}

function doAsync(req, res, next) {
  console.log('doing some useless async stuff...');
  setTimeout(function () {
    console.log('done!');
    next();
  }, 1000); // der aaye durust aaye - 1 second...
}
*/

function authen(req, res, next) {

  var cred = bAuth(req);
  var result = false;

  if (cred) {
      var result = (cred.name === "admin" && cred.pass === "secret");
  }
 
  if (result) {
    res.end();
  } else {
    res.writeHead(401, {"WWW-Authenticate": "Basic realm = 'foo'"});
    res.end();
  }
}

/*
function welcomeUser(req, res) {
  res.writeHead(200);
  res.end("Welcome" + req.params.name);
}
*/

//app.use(express.static('files'));
//app.use(helloMidWare);
//app.use(doAsync);
app.use(authen); 

//app.get("/:name", welcomeUser);

app.listen(port, function () {
  console.log('listening on port ' + port);
});