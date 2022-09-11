const { assignAlgoMax } = require("../utils/algorithm");
const db = require("../utils/initializeDataBase");
const moment = require("moment");
const { Op } = require("@sequelize/core");
const router = require("express").Router();

const sendEmail = require("../utils/sendEmail");
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

  const { skillsIds, shiftId } = req.body;

  try {
    await db.affectation.destroy({ where: { shiftId } });
    // get shifts affected today
    let listUserShift = await db.affectation.findAll({
      include: { all: true },
    });

    listUserShift = listUserShift.filter((elem) => {
      return (
        moment(elem.shift.startDate).format("YYYY-MM-DD") ===
        moment(new Date()).format("YYYY-MM-DD")
      );
    });

    // return res.send(listUserShift)
    // get user with skill
    const listUserSkills = await db.userSkills.findAll({
      where: {
        niveau: { [Op.gt]: 0 },
        skillId: { [Op.in]: skillsIds.map((elem) => elem.skillId) },
      },
    });

    let userWithSkills = listUserSkills.map((elem) => elem.userId);

    userWithSkills = [...new Set(userWithSkills)];

    userWithSkills = userWithSkills.filter(
      (userId) => !listUserShift.map((aff) => aff.userId).includes(userId)
    );

    const mappedUserIndex = userWithSkills.reduce((result, filter, index) => {
      result[index] = filter;
      return result;
    }, {});

    let listOfSkills = listUserSkills.map((elem) => elem.skillId);
    listOfSkills = [...new Set(listOfSkills)];
    let skills = [];
    skillsIds.forEach((skillelem) => {
      for (let i = 0; i < skillelem.effectif; i++) {
        skills.push(skillelem.skillId);
      }
    });

    const mappedSkillIndex = skills.reduce((result, filter, index) => {
      result[index] = filter;
      return result;
    }, {});

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
      where: { id: { [Op.in]: skillsIds.map((elem) => elem.skillId) } },
    });

    newfinalList = newfinalList.map((elem) => {
      elem[0] = users.find(
        (subElem) => subElem.id == mappedUserIndex[elem[0].toString()]
      ).dataValues;
      elem[1] = allSkills.find(
        (subElem) => subElem.id == mappedSkillIndex[elem[1].toString()]
      )?.dataValues;
      return elem;
    });

    // sendEmail("",users.map(user => user.email))
    // sendEmail("",["mohamedskander.bennia@gmail.com","boumenjel51@gmail.com"])
    return res.status(200).json(newfinalList);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getSkillsByUser,
  getBestSuggestion,
};
