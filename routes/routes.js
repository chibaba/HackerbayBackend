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
// // Task 1 ends here

// passport.use(
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//      function(email, password, done) {
    
//     User.findOne({ email: req.body.email}, (err, existingUser) =>{
//       .then(User => {
//           if(existingUser) {
//         return res.status(400).json({
//           message: (req.body.email + "User is currently existing")
//         })
//       } else {
//         User.save((err, User) => {
//          if (err) return next(err) 
//            if(User) {
//              res.status(200).json("New User has been created")
//             })
//           }
//         })
//         return done(null, User, {message: 'Invalid Password'})
//       }
//       });
//     }

//   )
// )

      
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function(email, password, done) {
      return User.findOne({ email, password })
        .then(User => {
          if (!User) {
            return done(null, false, {
              message: "Incorrect email or password"
            });
          } 
          return done(null, User, { message: "Logged In Successfully" });
        })
        .catch(err => done(err));
    }
  )
)

  //   passport.use(
  //   new LocalStrategy(
  //     function(email, password, done) {
  //       User.getUserByEmail(email, (err, User) =>{
  //         if(err) throw err;
  //         if(!user) {
  //           return done(null, false, {message: 'Unknown user'})
  //         }
  //         User.comparePassword(password, User.password, (err, isMatch) => {
  //           if(err) throw err;
  //           if(isMatch){
  //             return done(null, User)
  //           } else {
  //             return done(null, false, {message: 'Invalid Password'})
  //           }
  //         })
  //       })
  //     }
  //   )
  // )


  app.post('/signup', function(req, res) {
    var newUser = new User();
      newUser.email= req.body.email;
      newUser.password= req.body.password;

      User.findOne({ email: req.body.email}, (err, existingUser) =>{
        if(existingUser) {
      return res.status(400).json({
        message: (req.body.email + "User is currently existing")
      })
    } else {
      User.save((err, newUser) => {
       if (err) return next(err);
       res.json("New User has been created")
      })
    }
    })

    
    User.createUser(newUser, function(err, user){
      if(errors) {
        res.status(400).json({success: false, message: 'user is not registered '})
       // if(err) throw err;
        console.log(user)
      }
      });
      //res.status(200).json({success:true, message: 'user is registered'});
          res.status(200).json({ token: jwt.sign({ id: User.id}, 'newpassword  '),
          success: true,
          message: 'user created'
  
  })  
        
        })



// app.post('/signup', (req, res, next) =>{
//   let user = new User();

//   user.email=req.body.email;
//   user.password = req.body.password;

//   User.findOne({ email: req.body.email}, (err, existingUser) => {
//     if(existingUser) {
//       console.log(req.body.email + " is already existing ")
//       //return res.redirect('/signup');
//     }else {
//     user.save(function(err, user) {
//       if(err) return next(err);
//        res.status(200).json({success:true, message: 'user is registered'});
//           res.status(200).json({ token: jwt.sign({ id: User.id}, 'newpassword  '),
//           success: true,
//          message: 'user created'
  
//    })
//       res.json('Successfully created a new user')
//     })
//   }
// })

//})





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

  
  // app.post("/login", (req, res, next) => {
  //   passport.authenticate("local", (err, user, info) => {
  //     if (err) {
  //       return res.status(400).json({
  //         message: "Error logging in"
  //       });
  //     } else if (!user) {
  //       return res.status(404).json({
  //         message: "Incorrect Email or Password"
  //       });
  //     }
  //     req.login(User, err => {
  //       if (err) {
  //         return res.send(err);
  //       }
  //       return res.status(200).json({ token: jwt.sign({ id: User.id }, 'newpassword'),
  //         success: true,
  //              user: {
  //               id: User._id,
  //               email: User.email,
  //              }
  //       });
  //     });
  //   })(req, res);
  // });

  app.use((req, res, next) => {
    if (req.tokenPayload) {
      req.user = req.tokenPayload.id;
    }
    if (req.User) {
      return next();
    } else {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    }
  });


 

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
}