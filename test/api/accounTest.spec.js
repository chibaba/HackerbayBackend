const chaiHttp = require('chai-http');
const chai = require ('chai');
const request = 'request';
const supertest = require('supertest');
const server = require('../../');


const should = chai.should();
chai.use(chaiHttp);

describe('POST /signup', () => {
  it('it should able to register new account', done => {
    const params = {
      email: 'chibaba@gmail.com',
      password: 'we are here',
    };
    chai
      .request('http://localhost:5000')
      .post('/signup')
      .send(params)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
    
        res.body.should.have.property('token');
        res.body.should.have.property('success');
        done();
      });
  });
});


describe('Login/SignUp Routes', () => {
  describe('POST /login', () => {
    it('it should POST a login ', done => {
      const params = {
        email: 'chibaba@gmail.com',
        password: 'we are here',
      };
      chai
        .request('http://localhost:5000')
        .post('/login')
        .send(params)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });
    // it('it should return 400 when the user is not available ', done => {
    //   const params = {
    //     email: 'chinedua@gmail.com',
    //     password: '12345',
    //   };
    //   chai
    //     .request('http://localhost:5000')
    //     .post('/login')
    //     .send(params)
    //     .end((err, res) => {
    //       res.should.have.status(400);
    //       done();
    //     });
    // });
  });
})



