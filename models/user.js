const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    microsoftId: { type: DataTypes.STRING, allowNull: true },
    idMonitoring: { type: DataTypes.STRING, allowNull: true },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      allowNull: false,
      defaultValue: "user",
    },
  };

  const options = {};

  return sequelize.define("user", attributes, options);
}
