
var express = require( './.fake.express' )
  , request = require('supertest');

describe('req', function(){
  describe('.acceptsEncodingss', function(){
    it('should be true if encoding accpeted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsEncodings('gzip').should.be.ok;
        req.acceptsEncodings('deflate').should.be.ok;
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Encoding', ' gzip, deflate')
      .expect(200, done);
    })

    it('should be false if encoding not accpeted', function(done){
      var app = express();

      app.use(function(req, res){
        req.acceptsEncodings('bogus').should.not.be.ok;
        res.end();
      });

      request(app)
      .get('/')
      .set('Accept-Encoding', ' gzip, deflate')
      .expect(200, done);
    })
  })
})
