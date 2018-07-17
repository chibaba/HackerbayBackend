const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const express = require('express');
const app = require('express').Router

const LocalStrategy = require('passport-local').Strategy;

module.exports = (app, passport) => {
  // Task1 begins here

  app.get('/', (req, res) => {
    res.status(200).json({ status: 'success'});
  });
  
  let data = []
  app.post('/data',(req, res) => {
    let post = req.body.data
    data.push(post)
     res.json({post: 'this is how we role'})
     res.status(200)
  })
  
  app.get('/data', (req, res) => {
   res.status(200).json({data:data});
  })
// Task 2 ends here

      
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      function(email, password, done) {
        return User.findOne({ email, password })
          .then(user => {
            if (!user) {
              return done(null, false, {
                message: "Incorrect email or password"
              });
            }
            return done(null, user, { message: "Logged In Successfully" });
          })
          .catch(err => done(err));
      }
    )
  )


  app.post("/signup", (req, res) => {
    //let neuUser = {email, password}
    const  { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "details does not match"
      });
    }
    if (email && password) {
      User.findOrCreate({
        where: {
          email,
          password
        }
      }).spread((userResult, createUser) => {
        if (createUser) {
          return res.status(200).json({ token: jwt.sign({ id: User.id}, 'newpassword  '),
            success: true,
            createUser
          });
        } else {
          return res.status(400).json({
            message: false,
            message: "User is currently existing"
          });
        }
      });
    }
  });
  app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(400).json({
          message: "Error logging in"
        });
      } else if (!user) {
        return res.status(400).json({
          message: "Incorrect Email or Password"
        });
      }
      req.login(user, err => {
        if (err) {
          return res.send(err);
        }
        return res.json({ token: jwt.sign({ id: User.id }, 'newpassword'),
          success: true,
               user: {
                id: user._id,
                email: user.email,
               }
        });
      });
    })(req, res);
  });

  app.use((req, res, next) => {
    if (req.tokenPayload) {
      req.user = req.tokenPayload.id;
    }
    if (req.user) {
      return next();
    } else {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    }
  });


 
  app.get('/profile', passport.authenticate('local', {
    session: false
  }), (req, res) => {
    res.json({
      user: user.req
    });
  });
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
}