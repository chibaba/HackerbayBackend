const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const express = require('express');
const app = require('express').Router

const LocalStrategy = require('passport-local').Strategy;

module.exports = (app, passport) => {
  // Task 1
  // app.get('/', (req, res) => {
  //   res.status(200).json({ status: 'success' });
  // });

  // app.get('/data', (req, res) => {
  //   const post_data = req.session.post_data;
  //   res.status(200).json({
  //     data: post_data || 'Please do a post request before get last post data',
  //   });
  // });

  // app.post('/data', (req, res) => {
  //   const { data } = req.body;
  //   req.session.post_data = data;

  //   res.status(200).json({ data: data });

  // });

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
    //const { data } = req.body.data
   res.status(200).json({data:data});
  })


// let data = {};

// app.post("/data", (req, res) => {
//   data = req.body.data;
//   return res.status(200).json(data);
// });
// app.get("/data", (req, res) => {
//   return res.json(data);
// });

  // Task 1 ends here

  // passport.use(
  //   'local',
  //   new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'password',
  //     passReqToCallback: true,
  //   }, (email, password, done) => {
  //      return
  //     User.getUserByEmail(email, (err, user) => {
  //       if (err && !user) {
  //         res.status(500).json({
  //           success: false,
  //           message: 'sequelizeValidationError'
  //         })
  //       }
  //       User.comparePassword(password, user.password, (err, isMatch) => {
  //         if (err) {
  //           res.status(500)
  //         }
  //         if (isMatch) {
  //           const token = jwt.sign(user, 'newpassword', {
  //             expiresIn: 600000000
  //           });
  //           res.json({
  //             success: true,
  //             token: token,
  //             user: {
  //               id: user._id,
  //               email: user.email,

  //             }
  //           });
  //         } else {
  //           return res.status(500).json({
  //             success: false,
  //             message: 'sequelizeValidationError'
  //           })
  //         }
  //       })
  //     });

  //   })
  // )
      
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

  // app.get('/go', (req, res) => {
  //   res.json('welcome to authenticating jwt')
  // });


  // app.post('/User/signup', (req, res) => {
  //   const newUser = new User({
  //     email: req.body.email,
  //     password: req.body.password
  //   });
  //   User.createUser(newUser, (err, user) => {
  //     if (err) {
  //       res.json({
  //         success: false,
  //         message: 'user is not registered..'
  //       });
  //     } else {
  //       res.json({
  //         success: true,
  //         message: 'user is registered..'
  //       })
  //     }

  //   });
  // });
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


  // app.post('/User/login', passport.authenticate('local', {
  //   session: false
  // }), (req, res) => {
  //   res.redirect('/')
  // });
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