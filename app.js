const express = require('express');
const app = express();
var client = require('./connection.js');
app.use(require('express-status-monitor')());
var Elasticsearch = require('winston-elasticsearch');
var winston = require('winston'),
    expressWinston = require('express-winston');
var bodyParser = require('body-parser');
var axios = require('axios');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
 DelaySeconds: 10,
 MessageAttributes: {
  "Title": {
    DataType: "String",
    StringValue: "The Whistler"
   },
  "Author": {
    DataType: "String",
    StringValue: "John Grisham"
   },
  "WeeksOn": {
    DataType: "Number",
    StringValue: "6"
   }
 },
 MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
 QueueUrl: "SQS_QUEUE_URL"
};

app.use(expressWinston.logger({
  transports: [
    new Elasticsearch({level:'info'})
  ]
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/search/:term', (req, res) => {
	//Possibly come back and parse down how much data is sent to client.
	res.status(200);
	var searchTerm = req.params.term;

	client.search({
	  index: 'video',
	  type: 'uploaded',
	  body: {
	    query: {
		  fuzzy: {
		    "snippet.title": searchTerm
     	  }
        }
      }
	}).then(function (body) {
	  var hits = body.hits.hits;
	  res.send(hits);
	}, function (error) {
	  console.trace(error.message);
	  res.send('error!')
	});

})

app.get('/video/:id', (req, res) => {
	//Sends back a single video based on the ID, should be sent after user picks specific video in client.
	res.status(200);
	var searchTerm = req.params.id;

	client.search({
	  index: 'video',
	  type: 'uploaded',
	  body: {
	    query: {
		  match: {
		    "video_url_id": searchTerm
     	  }
        }
      }
	}).then(function (body) {
	  var hits = body.hits.hits;
	  res.send(hits);
	}, function (error) {
	  console.trace(error.message);
	  res.send('error!')
	});

})

app.get('newvideos', (req, res) =>{
	//Still need to add ability to process body, then upload to elasticsearch.
	res.status(200);
	axios.get('getfromQueURl')
	.then(function (response) {
		console.log(response)
	    client.index({  
		  index: 'video',
		  type: 'uploaded',
		  body: response })
	    res.send('Sent');
	})
	.catch(function (error) {
	    console.log(error);
	    res.send('Error');
	});
})

app.post('/clientEvent', (req, res) =>{
	res.status(201);
	var event = req.body;
	console.log(event);
	axios.post('https://sqs.us-west-2.amazonaws.com/867486098166/ClientEvents', event)  
	.then(function (response) {
    console.log(response);
    	res.send('Sent');
  })
    .catch(function (error) {
    console.log(error);
    	res.send('Error');
  });
})

app.post('/upload', (req, res) =>{
	res.status(201);
	var uploadObject = req.body;
	console.log(uploadObject);
	axios.post('theURLIWILLUSE', uploadObject)  
	.then(function (response) {
    console.log(response);
    	res.send('Sent');
  })
    .catch(function (error) {
    console.log(error);
    	res.send('Error');
  });
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

