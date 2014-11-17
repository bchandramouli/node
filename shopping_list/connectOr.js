#!/usr/bin/env node --debug

var LinkedIn = require('node-linkedin')('api', 'secret', 'callback');

var express = require('express'), port = 8000;

var app = express();

/* Init with the user token */
var linkedin = LinkedIn.init('18a7afd5-8a2e-48f9-ae2b-bb85e74df04f',  {
	timeout: 10000 // 10 seconds
});

app.get('/oauth/linkedin', function(req, res) {
	Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddres', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages']);
});

app.get('/oauth/linkedin/callback', function(req, res) {
	Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
		if (err) {
			return console.error(err);
		}

		console.log(results);
		return res.redirect('/');
	});
});