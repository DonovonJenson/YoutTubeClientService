const express = require('express');
const app = express();
var client = require('./connection.js');
app.use(require('express-status-monitor')());
var Elasticsearch = require('winston-elasticsearch');

var winston = require('winston'),
    expressWinston = require('express-winston');


    app.use(expressWinston.logger({
      transports: [
        new Elasticsearch({level:'info'})
      ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }));


app.get('/', (req, res) => {
	res.status(200);
	res.send('Hello World!');
});

app.get('/hi', (req, res) => res.send('Hey back to you, fella!'))

app.get('/search', (req, res) => {
	res.status(200);
	res.send();
})

app.post('/clientEvent', (req, res) =>{
	res.status(201);
	res.send();
})

app.post('/upload', (req, res) =>{
	rest.status(201);
	res.send();
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))