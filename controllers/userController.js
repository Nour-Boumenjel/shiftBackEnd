const db = require("../utils/initializeDataBase");
const { Op } = require("@sequelize/core");
const moment = require("moment");
/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the instance (project)
 *         firstName:
 *           type: string
 *           description: user FisrtName
 *         lastName:
 *           type: string
 *           description: user lastName
 *         email:
 *           type: string
 *           description: user email
 *        microsoftId:
 *           type: string
 *           description: user microsoftId
 *        idMonitoring:
 *           type: string
 *           description: user idMonitoring
 *
 *
 *
 *       example:
 *          firstName: "ahmded"
 *          lastName: "ahmed"
 *          email:    "user@gmail.com"
 *          microsoftId: "1235"
 *          idMonitoring : "123654"
 */



 const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: docs } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, docs, totalPages, currentPage };
};

const createUser = async (req, res) => {
  try {
    const user = await db.user.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [users]
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *
 */

const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({
      include: { all: true },
    });
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getAllUsersWithPagination = async (req, res) => {
  try {
    const { page, size } = req.query;
    const searchValue = req.query.searchValue;
    const { limit, offset } = getPagination(page, size);

    if (searchValue) {
      const users = await db.user.findAndCountAll({
        where: {
          [Op.or]: [{ firstName: { [Op.like]: `%${searchValue}%` } }],
        },
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(users, page, limit));
    } else {
      const users = await db.user.findAndCountAll({
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(users, page, limit));
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};






const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.user.findOne({
      where: { id: userId },
    });
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).send(" user does not exists");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const [updatedUser] = await db.user.update(req.body, {
      where: { id: userId },
    });
    if (updatedUser) {
      const updateUser = await db.user.findOne({ where: { id: userId } });
      return res.status(200).json({ type: updateUser });
    }
    throw new Error("user not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params;
    const deletedUser = await db.user.destroy({ where: { id: userId } });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const addSkillToUser = async (req, res, next) => {
  try {
    const { userId, skillId, niveau } = req.body;

    const skill = await db.skills.findByPk(skillId);
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.send("you need to provide the correct user id");
    }
    if (!skill) {
      return res.send("you need to provide the correct skill id");
    }

    let newUserSkill = await db.userSkills.findOrCreate({
      where: { skillId, userId, niveau },
    });
    if (newUserSkill) {
      return res
        .status(400)
        .json({ message: "this skill is already affected to user" });
    }
    // if (result.toString() === "0")
    //
    res.send("skill affected to user");
  } catch (err) {
    console.log(err);
  }
};

const getFreeUser = async (req, res) => {
  let dateNow = new Date();
  dateNow = moment(dateNow).format("YYYY-MM-DD");
  let shifts = await db.shift.findAll({});
  const filteredShifts = shifts.filter((shift) => {
    let startDate = moment(shift.startDate).format("YYYY-MM-DD");
    let endDate = moment(shift.endDate).format("YYYY-MM-DD");
    return (
      new Date(startDate).getTime() <= new Date(dateNow).getTime() &&
      new Date(endDate).getTime() >= new Date(dateNow).getTime()
    );
  });

  const affectations = await db.affectation.findAll({
    where: {
      shiftId: { [Op.in]: filteredShifts.map((shift) => shift.id) },
    },
  });
  const users = await db.user.findAll({
    where: {
      id: { [Op.notIn]: affectations.map((aff) => aff.userId) },
    },
  });
  res.send(users);
};

const getWorkedUser = async(req,res) => {

  const affectations = await db.affectation.findAll({
    include: { all: true },
   
    },
  );
  const users = await db.user.findAll({
    where: {
      id: { [Op.in]: affectations.map((aff) => aff.userId) },
    },
  });
  res.send(users);

}
const getUserBySkills = async (req,res)=>{
  const {skillIds} = req.body
  let usersSkills= await db.userSkills.findAll({ where:{ skillId:{[Op.in]:skillIds} },include:{all:true}});
  console.log(usersSkills)
  usersSkills = usersSkills.map(userSkill => {
    return { firstName:userSkill.dataValues.user.dataValues.firstName, lastName:userSkill.dataValues.user.dataValues.lastName, skill:{name:userSkill.dataValues.skill.dataValues.name}}
  })
  res.send(usersSkills);
}


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addSkillToUser,
  getFreeUser,
  getWorkedUser,
  getUserBySkills,
  getAllUsersWithPagination
};
