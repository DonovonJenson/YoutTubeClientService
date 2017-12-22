const express = require('express');
const app = express();
var client = require('./connection.js');
app.use(require('express-status-monitor')());
var Elasticsearch = require('winston-elasticsearch');
var winston = require('winston'),
    expressWinston = require('express-winston');
var bodyParser = require('body-parser');
var axios = require('axios');
const Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');
var keys = require('./AWS.js');
AWS.config.update({
  region: 'us-west-2',
  accessKeyId: keys.aws_access_key_id,
  secretAccessKey: keys.aws_secret_access_key
});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

app.use(expressWinston.logger({
  transports: [
    new Elasticsearch({level:'info'})
  ]
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Route to return a list of videos based on search term
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


//Route to return a specific video 
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

//Consumer uses polling to check for new videos
const findVideos = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/867486098166/Uploads',
  handleMessage: (message, done) => {
    var inputVideo = JSON.parse(message.Body)
    console.log(inputVideo)
   	client.index({  
	  index: 'video',
	  type: 'uploaded',
	  body: inputVideo })
	  res.send('Sent');
    done();
  },
  sqs: new AWS.SQS()
});
 
findVideos.on('error', (err) => {
  console.log(err.message);
});
 
findVideos.start();

//End Consumer


//Route for testing Elasticsearch writing
// app.post('/dbWriteTestRoute', (req, res) => {
// 	var video = JSON.stringify({"video_url_id":"Ks-_Mh1QhMc","snippet":{"publishedAt":"2017-12-20T09:24:56.000Z","channelId":"UCo7i93EtJhQub3SDKrtIAPA","title":"Rap 2018: Best Rap Songs 2018 (Top Trap Rap & Rap Music Playlist)","description":"\"Music can change the world because it can change people....","thumbnails":{"url":"https://i.ytimg.com/vi/4LfJnj66HVQ/default.jpg","width":120,"height":90},"channelTitle":"#RedMusic: HotMusicCharts","Tags":["Amy Cuddy","TED","TEDTalk","TEDTalks","TED Talk","TED Talks","TEDGlobal","brain","business","psychology","self","Success"],"categoryId":"22","duration":150,"statistics":{"viewCount":13403317,"likeCount":171513,"dislikeCount":3214,"favoriteCount":0,"commentCount":6692}}});
// 	var inputVideo = JSON.parse(video)
//    	client.index({  
// 	  index: 'video',
// 	  type: 'uploaded',
// 	  body: inputVideo })
// 	  res.send('Sent');

// })


//Route for new events from the client
app.post('/clientEvent', (req, res) =>{
	res.status(201);
	var event = req.body;

var params = {
 DelaySeconds: 10,
 MessageBody: JSON.stringify(req.body),
 QueueUrl: "https://sqs.us-west-2.amazonaws.com/867486098166/ClientEvents"
};

sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
    res.send("Error");
  } else {
    console.log("Success", data.MessageId);
    res.send("Success");
  }
});


})


//Route for new videos uploaded from client
app.post('/upload', (req, res) =>{
	res.status(201);
	var uploadObject = req.body;
	console.log(uploadObject);

	var params = {
	 DelaySeconds: 10,
	 MessageBody: JSON.stringify(req.body),
	 QueueUrl: "https://sqs.us-west-2.amazonaws.com/867486098166/Uploads"
	};

	sqs.sendMessage(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	    res.send('Error');
	  } else {
	    console.log("Success", data.MessageId);
	    res.send('Sent');
	  }
	});

})

app.listen(3000, () => console.log('listening on port 3000!'))

