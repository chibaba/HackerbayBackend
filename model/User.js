
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize("palandas", "postgres", "newpassword", {
  host: "localhost",
  dialect: "postgres"
})

const attributes = {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
      isUnique: function (value, next) {
        var self = this;
        User.find({
            where: {
              email: value
            }
          })
          .then(function (user) {
            // reject if a different user wants to use the same email
            if (user && self.id !== user.id) {
              return next('Email already in use!');
            }
            return next();
          })
          .catch(function (err) {
            return next(err);
          });
      }
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  }
}

const User = sequelize.define(
  "users", attributes, {
    timestamps: true
  }
);




module.exports = User