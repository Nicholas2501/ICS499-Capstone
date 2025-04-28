"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "ptoBalance", {
      type: Sequelize.INTEGER,
      defaultValue: 15, // Default PTO balance
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Users", "ptoBalance", {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    });
  },
};