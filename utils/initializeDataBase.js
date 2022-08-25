const config = require("../utils/config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};
initialize();

async function initialize() {
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  // await connection.query("DROP DATABASE "+ database)
  // await connection.query("CREATE DATABASE "+ database)
  //  await connection.query(`CREATE DATABASE IF NOT EXISTS  \`${database}\`;`);
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  db.shift = require("../models/shift")(sequelize);
  db.type = require("../models/type")(sequelize);
  db.skills = require("../models/skills")(sequelize);
  db.pool = require("../models/pool")(sequelize);
  db.user = require("../models/user")(sequelize);
  db.affectation = require("../models/affectation")(sequelize);
  db.userSkills = require("../models/userSkills")(sequelize);
  db.groupSkills = require("../models/groupSkills")(sequelize);
  db.shiftSkills = require("../models/shiftSkills")(sequelize);
  db.skillsBelongsToGroupSkills =
    require("../models/skillsBelongsToGroupSkills")(sequelize);

  //foreignKey
  db.shift.belongsToMany(db.user, { through: "affectations", as: "user" });
  db.user.belongsToMany(db.shift, { through: "affectations", as: "shift" });

  db.pool.belongsToMany(db.shift, { through: "ShiftPools" });
  db.shift.belongsToMany(db.pool, { through: "ShiftPools" });

  db.user.belongsToMany(db.skills, { through: "userSkills" });
  db.skills.belongsToMany(db.user, { through: "userSkills" });

  db.shift.belongsTo(db.type, {
    foreignKey: "typeId",
    as: "type",
  });
  db.type.hasMany(db.shift, { as: "shifts" });
  db.pool.belongsToMany(db.skills, { through: "poolSkills" });

  db.pool.belongsToMany(db.user, { through: "userPool" });
  db.user.belongsToMany(db.pool, { through: "userPool" });

  db.shiftSkills.belongsTo(db.skills, {
    foreignKey: "skillId",
    as: "skill",
    onDelete: "CASCADE",
  });
  db.shiftSkills.belongsTo(db.shift, {
    foreignKey: "shiftId",
    as: "shift",
    onDelete: "CASCADE",
  });
  db.shiftSkills.belongsTo(db.groupSkills, {
    foreignKey: "groupSkillId",
    as: "groupSkill",
    onDelete: "CASCADE",
  });

  db.groupSkills.belongsToMany(db.skills, {
    through: "skillsBelongsToGroupSkills",
  });
  db.skills.belongsToMany(db.groupSkills, {
    through: "skillsBelongsToGroupSkills",
  });
  await db.type.findOrCreate({
    where: { name: "Day Off", color: "grey" },
  });
  await sequelize.sync({ alter: false });
}
