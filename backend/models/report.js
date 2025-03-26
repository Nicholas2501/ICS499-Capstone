module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('report', {
      // Add any report-specific fields here
      generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
  
    return Report;
  };