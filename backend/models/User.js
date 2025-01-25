module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      Name: DataTypes.STRING,
      Role: DataTypes.STRING,
      Email: { type: DataTypes.STRING, unique: true },
      Password: DataTypes.STRING,
      PTO_Balance: { type: DataTypes.INTEGER, defaultValue: 0 },
      Sick_Leave_Balance: { type: DataTypes.INTEGER, defaultValue: 0 },
    });
    return User;
  };0