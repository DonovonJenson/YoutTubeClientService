var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'http://elastic:@127.0.0.1:9200/',
    //'https://[username]:[password]@localhost:9200/'
  ]
});

module.exports = client;