module.exports = (sequelize, DataTypes) => {
  const PTORequest = sequelize.define("PTORequest", {
    Start_Date: DataTypes.DATE,
    End_Date: DataTypes.DATE,
    Leave_Type: DataTypes.STRING,
    Status: { type: DataTypes.STRING, defaultValue: "Pending" },
    Manager_Comment: DataTypes.TEXT,
  });
  return PTORequest;
};