"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "LeavePolicies", // Table name
      [
        {
          leaveType: "Vacation",
          role: "Employee",
          maxDaysPerYear: 15,
          carryoverAllowed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          leaveType: "Sick Leave",
          role: "Employee",
          maxDaysPerYear: 10,
          carryoverAllowed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          leaveType: "Personal Leave",
          role: "Manager",
          maxDaysPerYear: 5,
          carryoverAllowed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("LeavePolicies", null, {});
  },
};