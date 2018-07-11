const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
   sequelize : new Sequelize("palandas", "postgres", "newpassword",{
    host: "localhost",
    port: 5000,
    dialect: "postgres",
    secret: "newpassword",
    operatorsAliases: false
  })
} 