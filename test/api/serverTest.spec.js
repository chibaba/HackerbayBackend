const chaiHttp = require('chai-http');
const chai = require ('chai');
const request = require('request');
const supertest = require('supertest');
const server = require('../../');

const should = chai.should();
chai.use(chaiHttp);

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return a 200 response', done => {
      chai
        .request('http://localhost:5000')
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.be.eql('success');
          done();
        });
    });
    it('should return a 404 response', done => {
      chai
        .request('http://localhost:5000')
        .get('/not home')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /data', () => {
    it('should return a response of 200', done => {
      chai
        .request('http://localhost:5000')
        .get('/data')
        .end((err, res) => {
          res.should.have.status(200);
           res.body.should.be.a('object');
         
          done();
        });
    });
  });

  describe('POST /data', () => {
    it('it should POST a data ', done => {
      const params = {
        post: 'this is how we role',
      };
      chai
        .request('http://localhost:5000')
        .post('/data')
        .send(params)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
         res.body.should.have.property('post').eql(params.post);
          done();
        });
    });
  });
});
