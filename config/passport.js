const LocalStrategy = require('passport-local').Strategy;
 const  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports= (passport) => {

  passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) =>{
  //User.getUserById(id, (err, user) => {
    User.find({
      where: {
        email:email
      }
    })
    done(err, user);
  })
}

