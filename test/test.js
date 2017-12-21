var expect  = require("chai").expect;
var request = require("request");
var assert = require('assert');


describe('Routes', function() {

  var url = "http://localhost:3000/";


  describe('Search Video DB', function() {
    it("returns status 200", (done) => {
      request(url+'search/hello', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns an object", (done) => {
      request(url+'search/hello', function(error, response, body) {
        expect(JSON.parse(body)).to.be.an('Array');
        done();
      });
    });

  });

  describe('Search Video ID', function() {

    it("returns status 200", (done) => {
      request(url+'video/Ks-_Mh1QhMc', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it("returns an object", (done) => {
      request(url+'video/Ks-_Mh1QhMc', function(error, response, body) {
        expect(JSON.parse(body)).to.be.an('Array');
        done();
      });
    });

  });

});
