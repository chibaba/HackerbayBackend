const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const express = require('express');
const app = require('express').Router

const Strategy = require('passport-local').Strategy;

module.exports = (app, passport) => {
  // Task 1
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'success' });
  });

  app.get('/data', (req, res) => {
    const post_data = req.session.post_data;
    res.status(200).json({
      data: post_data 
    });
  });

  app.post('/data', (req, res) => {
    const { data } = req.body;
    req.session.post_data = data;

    res.status(200).json({ data: data });
  });

  // Task 1 ends here

  passport.use(
    'local',
    new Strategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    }, (email, password, done) => {

      User.getUserByEmail(email, (err, user) => {
        if (err && !user) {
          res.status(500).json({
            success: false,
            message: 'sequelizeValidationError'
          })
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500)
          }
          if (isMatch) {
            const token = jwt.sign(user, 'newpassword', {
              expiresIn: 600000000
            });
            res.json({
              success: true,
              token: token,
              user: {
                id: user._id,
                email: user.email,

              }
            });
          } else {
            return res.status(500).json({
              success: false,
              message: 'sequelizeValidationError'
            })
          }
        })
      });

    })
  )


  app.get('/go', (req, res) => {
    res.json('welcome to authenticating jwt')
  });


  app.post('/signup', (req, res) => {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    User.createUser(newUser, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'user is not registered..'
        });
      } else {
        res.json({
          success: true,
          message: 'user is registered..'
        })
      }

    });
  });

  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/')
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