module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("PTORequests", "daysRequested", {
      type: Sequelize.INTEGER,
      allowNull: false, // Ensure the column cannot be null
      defaultValue: 0, // Optional: Set a default value for existing rows
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("PTORequests", "daysRequested");
  },
};