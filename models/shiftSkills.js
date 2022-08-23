const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    effectif: { type: DataTypes.STRING },
  };

  const options = {};

  return sequelize.define("shiftSkills", attributes, options);
}
