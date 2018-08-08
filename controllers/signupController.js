

var bcrypt = require('bcrypt'),
    User = require('../model/User')

module.exports = function(req, res) {
  var email = req.body.email
  var password = req.body.password
  
  var salt = bcrypt.genSaltSync(10)
  password =  bcrypt.hashSync(password, salt);
  var newUser = {
    email: email,
    salt: salt,
    password
  }
  User.sync({force: false}).then(function() {
    User.create(newUser).then(function(user) {
      console.log(user)
      res.status(200).json({
        message: 'Created Successfully',
        user: user,
        success: true
      })
    }).catch(function(error) {
      res.status(404).json({
        error: error,
        message: 'This user already exist',
        success: false
      })
  })
  })


}