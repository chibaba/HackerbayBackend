

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt'),
    User = require('../model/User')

module.exports = function(app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(username, password, done) {
      User.findOne({
        where: {
          'email': username
        }
      }).then(function (user) {
        if (user == null) {
          return done(null, false, { message: 'Incorrect credentials.' })
        }
        console.log(user)
        var hashedPassword = bcrypt.hashSync(password, user.salt)
        console.log(user.password)
        console.log(hashedPassword)
        if (user.password === hashedPassword) {
          return done(null, user)
        }
        
        return done(null, false, { message: 'Incorrect credentials.' })
      })
    }
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({
      where: {
        'id': id
      }
    }).then(function (user) {
      if (user == null) {
        done(new Error('Wrong user id'))
      }
      done(null, user)
    })
  })
}