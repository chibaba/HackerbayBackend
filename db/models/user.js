import sequelize from 'sequelize'
export default (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
      email: DataTypes.STRING,
      password: DataTypes.STRING
    }, {});
    User.associate = function(models) {
      User.hasMany(models.Website)
    };
    return User;
  };