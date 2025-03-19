module.exports = (sequelize, DataTypes) => {
  const LeavePolicy = sequelize.define(
    "LeavePolicy",
    {
      leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      maxDaysPerYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carryoverAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return LeavePolicy;
};