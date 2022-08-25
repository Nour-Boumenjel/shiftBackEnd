const { assignAlgoMax } = require("../utils/algorithm");
const db = require("../utils/initializeDataBase");
const { Op } = require("@sequelize/core");
const router = require("express").Router();

const getSkillsByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const skills = await db.userSkills.findAll({
      where: { userId: userId },
    });
    res.status(200).json(skills);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBestSuggestion = async (req, res) => {
  // skills ids
  const { skillsIds } = req.body;
  console.log(skillsIds);
  try {
    const listUserSkills = await db.userSkills.findAll({
      where: { niveau: { [Op.gt]: 0 }, skillId: { [Op.in]: skillsIds } },
    });
    console.log(listUserSkills[1]);
    let userWithSkills = listUserSkills.map((elem) => elem.userId);
    userWithSkills = [...new Set(userWithSkills)];
    console.log(userWithSkills);
    const mappedUserIndex = userWithSkills.reduce((result, filter, index) => {
      result[index] = filter;
      return result;
    }, {});

    console.log(mappedUserIndex);
    let skills = listUserSkills.map((elem) => elem.skillId);
    skills = [...new Set(skills)];
    const mappedSkillIndex = skills.reduce((result, filter, index) => {
      result[index] = filter;
      return result;
    }, {});
    console.log(skills);
    console.log("mappedSkillIndex", mappedSkillIndex);
    console.log("--------------------------------------------------1");
    let finalList = userWithSkills.map((user) => {
      return skills.map((skill) => {
        return listUserSkills.find((el) => {
          return el.dataValues.userId == user && el.dataValues.skillId == skill;
        })
          ? parseInt(
              listUserSkills.find((el) => {
                return (
                  el.dataValues.userId == user && el.dataValues.skillId == skill
                );
              }).dataValues.niveau
                ? listUserSkills.find((el) => {
                    return (
                      el.dataValues.userId == user &&
                      el.dataValues.skillId == skill
                    );
                  }).dataValues.niveau
                : 0
            )
          : 0;
      });
    });
    console.log("--------------------------------------------------2");
    console.log(finalList);
    if (finalList.length == 0) {
      throw Error("no users with skills");
    }
    let newfinalList = assignAlgoMax(finalList);
    console.log(newfinalList);
    const users = await db.user.findAll({
      where: { id: { [Op.in]: userWithSkills } },
    });
    const allSkills = await db.skills.findAll({
      where: { id: { [Op.in]: skillsIds } },
    });
    newfinalList = newfinalList.map((elem) => {
      elem[0] = users.find(
        (subElem) => subElem.id == mappedUserIndex[elem[0].toString()]
      ).dataValues.firstName;
      elem[1] = allSkills.find(
        (subElem) => subElem.id == mappedSkillIndex[elem[1].toString()]
      )?.dataValues.name;
      return elem;
    });

    return res.status(200).json(newfinalList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getSkillsByUser,
  getBestSuggestion,
};
