const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
   sequelize : new Sequelize("palandas", "postgres", "newpassword",{
    host: "localhost",
    dialect: "postgres",
    secret: "newpassword",
    operatorsAliases: Op
  })
} 