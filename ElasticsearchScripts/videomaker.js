var client = require('../connection.js');
var wordMix = require('./wordMix.js');

var videoTemplate = {
  "video_url_id": 'Ks-_Mh1QhMc',
  "snippet": {
  "publishedAt": "2017-12-20T09:24:56.000Z",
  "channelId": "UCo7i93EtJhQub3SDKrtIAPA",
  "title": "Rap 2018: Best Rap Songs 2018 (Top Trap Rap & Rap Music Playlist)",
  "description": "\"Music can change the world because it can change people....",
  "thumbnails": {
    "url": "https://i.ytimg.com/vi/4LfJnj66HVQ/default.jpg",
    "width": 120,
    "height": 90
  },   
  "channelTitle": "#RedMusic: HotMusicCharts",
    "Tags" : [
      "Amy Cuddy",
      "TED",
      "TEDTalk",
      "TEDTalks",
      "TED Talk",
      "TED Talks",
      "TEDGlobal",
      "brain",
      "business",
      "psychology",
      "self",
      "Success"],
    "categoryId": "22",
    "duration": 150,
    "statistics": {
      "viewCount": 13403317,
       "likeCount": 171513,
       "dislikeCount": 3214,
       "favoriteCount": 0,
       "commentCount": 6692
    }
  }
}


function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

function randomWords(number){
  var randoms = [];
  for (var i = 0; i < number; i++){
    randoms.push(wordMix[randomNumber(0,wordMix.length-1)]);
  }
  return randoms;
}

function randomMix(number){
  var possibilities = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  var mixString = ''
  for (var i = 0; i < number; i++){
    var mix = possibilities[randomNumber(0,possibilities.length-1)];
    mixString += mix;
  }
  return mixString; 
}

var loop = 0;

function addVideos(){  
  var videos = [];
for (let i = 0; i < 10000; i++){
  let video = {
  "video_url_id": 'Ks-_Mh1QhMc',
  "snippet": {
  "publishedAt": "2015-06-05T09:24:56.000Z",
  "channelId": "UCo7i93EtJhQub3SDKrtIAPA",
  "title": "Rap 2018: Best Rap Songs 2018 (Top Trap Rap & Rap Music Playlist)",
  "description": "\"Music can change the world because it can change people....",
  "thumbnails": {
    "url": "https://i.ytimg.com/vi/4LfJnj66HVQ/default.jpg",
    "width": 120,
    "height": 90
  },   
  "channelTitle": "#RedMusic: HotMusicCharts",
    "Tags" : [
      "Amy Cuddy",
      "TED",
      "TEDTalk",
      "TEDTalks",
      "TED Talk",
      "TED Talks",
      "TEDGlobal",
      "brain",
      "business",
      "psychology",
      "self",
      "Success"],
    "categoryId": "22",
    "duration": 150,
    "statistics": {
      "viewCount": 13403317,
       "likeCount": 171513,
       "dislikeCount": 3214,
       "favoriteCount": 0,
       "commentCount": 6692
    }
  }
}
  video.video_url_id = randomMix(11);
  video.snippet.publishedAt = new Date();
  video.snippet.channelId = randomMix(24);
  video.snippet.title = randomWords(3).join(' ');
  video.snippet.description = randomWords(10).join(' ');
  video.snippet.thumbnails.url = `website.com/{video.video_url_id}.jpg`
  video.snippet.channelTitle = randomWords(2);
  video.snippet.Tags = []
  for (var o = 0; o < 5; o++){
    video.snippet.Tags.push(randomWords(1))
  }
  video.snippet.categoryId = randomNumber(1, 1800).toString()
  video.snippet.duration = randomNumber(1, 1800);
  video.snippet.statistics.viewCount = randomNumber(0, 100000000);
  video.snippet.statistics.dislikeCount = randomNumber(0, 1000000);
  video.snippet.statistics.likeCount = randomNumber(0, 1000000);
  video.snippet.statistics.favoriteCount = randomNumber(0, 1000000);
  video.snippet.statistics.commentCount = randomNumber(0, 1000000);
  videos.push({ index:  { _index: 'video', _type: 'uploaded'} })
  videos.push(video);
}

client.bulk({  
  body: videos
    },function(err,resp,status) {
    console.log(err, resp, status);
    loop++;
    if (loop < 1000){
      addVideos()
    }
});


}

addVideos();


