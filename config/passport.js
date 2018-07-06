const LocalStrategy = require('passport-local').Strategy;
 const  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports= (passport) => {

  passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) =>{
  User.getUserById(id, (err, user) => {
    done(err, user);
  })
})
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = 'newpassword';
  passport.use(
    new LocalStrategy(opts, (jwt_payload, done) => {
      User.getUserById( jwt_payload._doc._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
}