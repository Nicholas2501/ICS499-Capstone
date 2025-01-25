const { Sequelize } = require("sequelize");
const PTORequest = require("./PTORequest");
const User = require("./User");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const models = {
  PTORequest: PTORequest(sequelize, Sequelize.DataTypes),
  User: User(sequelize, Sequelize.DataTypes),
};

// Sync all models with the database
sequelize.sync().then(() => {
  console.log("Database synced");
});

module.exports = { sequelize, ...models };