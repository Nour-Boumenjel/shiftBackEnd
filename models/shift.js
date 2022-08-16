const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
    const attributes = {
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
    };
  
    const options = {};
  
    return sequelize.define("shifts", attributes, options);
  }
  