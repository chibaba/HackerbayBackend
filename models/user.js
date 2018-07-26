const config = require('../config/database');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Strategy = require('passport-local')

  const sequelize = new Sequelize("palandas", "postgres", "newpassword", {
    host: "localhost",
    //port: 5432,
   dialect: "postgres",
   operatorsAliases: false,
   pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
  
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
  },

      
    );
    sequelize.sync({force: false}).then(() => {
      User.create({
      
        

            email :'chibaba@gmail.com',
            password : 'we are hwer'
          
        
      });
    });
    
    
    
    
    
module.exports = User ;




module.exports.getUserById = (id, cb) => {
  User.findById(id, cb);
}
module.exports.getUserByEmail = (email, cb) => {
  User.findOne({email:email}, cb);
}
module.exports.createUser = (newUser, cb) => {
  bcrypt.genSalt(10, (err, salt)=>{
       bcrypt.hash(newUser.password, salt, (err, hash)=>{
        // newUser.password = hash;
         
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