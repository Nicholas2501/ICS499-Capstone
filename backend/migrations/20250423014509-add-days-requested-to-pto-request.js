module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("PTORequests", "daysRequested", {
      type: Sequelize.INTEGER,
      allowNull: false, // Ensure the column cannot be null
      defaultValue: 0, // Default value in case of existing rows
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("PTORequests", "daysRequested");
  },
};