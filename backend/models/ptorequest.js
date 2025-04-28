module.exports = (sequelize, DataTypes) => {
  const PTORequest = sequelize.define(
    "PTORequest",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      managerComment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      daysRequested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: true,
    }
  );

  // Define associations here
  PTORequest.associate = (models) => {
    PTORequest.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return PTORequest;
};