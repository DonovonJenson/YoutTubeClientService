var expect  = require("chai").expect;
var request = require("request");
var assert = require('assert');

var superagent = require('superagent');

describe("Upload Route", function() {
    it("Respondes with 201", function(done) {
        superagent.post('localhost:3000/upload')
        .set('Content-Type', 'application/json')
        .send('{"fieldName":"data"}')
        .end(function(err,res){
            expect(res.statusCode).to.equal(201)
            done();
        })
    });        
});

describe("Client Event Route", function() {
    it("Responds with 201", function(done) {
        superagent.post('localhost:3000/clientEvent')
        .set('Content-Type', 'application/json')
        .send('{"fieldName":"data"}')
        .end(function(err,res){
            expect(res.statusCode).to.equal(201)
            done();
        })
    });        
});


describe('Get Routes', function() {

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
