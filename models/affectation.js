const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    startTime: { type: DataTypes.TIME},
    endTime: { type: DataTypes.TIME},
  };

  const options = {};

  return sequelize.define("affectations", attributes, options);
}
