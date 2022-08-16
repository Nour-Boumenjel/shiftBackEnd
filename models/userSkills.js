const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    niveau: { type: DataTypes.INTEGER, allowNull: true },

  };

  const options = {};

  return sequelize.define("userSkills", attributes, options);
}
