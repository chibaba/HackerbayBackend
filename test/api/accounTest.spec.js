const chaiHttp = require('chai-http');
const chai = require ('chai');
const request = 'request';
//const supertest = require('supertest');
const server = require('../../');


const should = chai.should();
chai.use(chaiHttp);

describe('POST /signup', () => {
  it('it should able to register new account', done => {
    const params = {
      email: 'chiscript@gmail.com',
      password: 'they are here',
    };
    chai
      .request('http://localhost:5000')
      .post('/signup')
      .send(params)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message')
        res.body.should.have.property('success');
        done();
      });
  });
  it('it should return 200 when User is already registered in db ', done => {
    const params = {
      email: 'chiscript@gmail.com',
      password: 'they are here',
    };
    chai
      .request('http://localhost:5000')
      .post('/signup')
      .send(params)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });


});


describe('Login/SignUp Routes', () => {
  describe('POST /login', () => {
    it('it should POST a login ', done => {
      const params = {
        email: 'chiscript@gmail.com',
        password: 'they are here',
      };
      chai
        .request('http://localhost:5000')
        .post('/login')
        .send(params)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('success')
          res.body.should.have.property('user')
          done();
        });
    });
    it('it should return 401 when User is not signedup in db ', done => {
      const params = {
        email: 'chinedua@gmail.com',
        password: '12345',
      };
      chai
        .request('http://localhost:5000')
        .post('/login')
        .send(params)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should return 400 when User dosent have password ', done => {
      const params = {
        email: 'chiscript@gmail.com',
        password: ''
      };
      chai
        .request('http://localhost:5000')
        .post('/login')
        .send(params)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
})



