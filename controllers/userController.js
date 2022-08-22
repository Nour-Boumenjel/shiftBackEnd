const db = require("../utils/initializeDataBase");

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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addSkillToUser,
};
