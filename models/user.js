//const Sequelize = require('sequelize');
const config = require('../config/database');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Strategy = require('passport-local')

//module.exports = (sequelize, DataTypes) => {
  const sequelize = new Sequelize("palandas", "postgres", "newpassword", {
    host: "localhost",
   dialect: "postgres"
 })
const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    email:  {
          type: Sequelize.STRING,
          isUnique: true,
          allowNull: false,
          isEmail: true
         },
    password: Sequelize.STRING
  },
  {
    hooks: {
      beforeValidate: User => {
        User.password = bcrypt.hashSync(User.password, 10);
      }
    }
  }
);


module.exports = User ;

// module.exports = (passport, User) => {
//   passport.use(
//     'local',
//     new Strategy(
//       {
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true,
//       },
//     )
//   )
// }

module.exports.getUserById = (id, cb) => {
  User.findById(id, cb);
}
module.exports.getUserByEmail = (email, cb) => {
  User.findOne({email:email}, cb);
}
module.exports.createUser = (newUser, cb) => {
  bcrypt.genSalt(10, (err, salt)=>{
       bcrypt.hash(newUser.password, salt, (err, hash)=>{
         
          if(err) {
            return err
        }
        // newUser.password = hash;
         newUser.save(cb);
       })
  })
}
module.exports.comparePassword = (myPassword, hash, cb) => {
  bcrypt.compare(myPassword, hash, (err, isMatch) => {
    if(err) {
      return res.status(500)
    }
    cb(null, isMatch)
  })
}