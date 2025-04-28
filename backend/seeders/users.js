"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "hashedPassword123", // Replace with a hashed password
          role: "Employee",
          ptoBalance: 15, // Initial PTO balance for Employees
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          password: "hashedPassword456", // Replace with a hashed password
          role: "Manager",
          ptoBalance: 20, // Initial PTO balance for Managers
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};