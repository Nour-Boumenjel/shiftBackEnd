const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    
    
  };

  const options = {};

  return sequelize.define("skillsBelongsToGroupSkills", attributes, options);
}
