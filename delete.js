var client = require('./connection.js');

client.indices.delete({index: 'video'},function(err,resp,status) {  
  console.log("delete",resp);
});