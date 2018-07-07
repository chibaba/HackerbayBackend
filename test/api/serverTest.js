const chaiHttp = require('chai-http');
const chai = require ('chai');
const request = 'request';
const supertest = require('supertest');
const index = require('../../');

const should = chai.should();
chai.use(chaiHttp);

describe('API Routes', () => {
  describe('GET /', () => {
    it('should return a 200 response', done => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.be.eql('success');
          done();
        });
    });
  });

  describe('GET /data', () => {
    it('should return data with missing post data', done => {
      chai
        .request(server)
        .get('/data')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.data.should.be.eql(
            'Please do a post request before get last post data'
          );
          done();
        });
    });
  });

  describe('POST /data', () => {
    it('it should POST a data ', done => {
      const params = {
        data: 'this is post params',
      };
      chai
        .request(server)
        .post('/data')
        .send(params)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data').eql(params.data);
          done();
        });
    });
  });
});
