const db = require('../utils/initializeDataBase');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
/**
 * @swagger
 * components:
 *   schemas:
 *     groupSkills:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the instance (project)
 *         name:
 *           type: string
 *           description: The Groupskill name
 *        
 *
 *       example:
 *         name: "Front end"
 */

/**
 * @swagger
 * /groupSkills/:
 * 
 *  post:
 *   summary: Creates a new group skill
 *   tags: [groupSkills]
 *
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/groupSkills'
 *
 *   responses:
 *     201:
 *       description: Creates a new groupSkill
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/groupSkills'
 *
 */



const createGroupSkills = async(req,res)=> {
    try{
    const group = await db.groupSkills.create(req.body)
       return res.status(201).json(
      group,
    );
    }
    catch(error){
        // return res.status(500).json({error: error.message})
        return res.status(500).send("Something is wrong")

    }
}

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

/**
 * @swagger
 * /groupSkills:
 *   get:
 *     tags: [groupSkills]
 *     description: Get all group skills
 *     responses:
 *       200:
 *         description: Success
 *
 */


const getAllGroupSkills = async (req,res) => {
    try{
  const groups = await db.groupSkills.findAll({
    include : {all:true}});
  res.status(200).json(groups)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}

const getAllGroupSkillsWithPagination = async (req, res) => {
  try {
    const { page, size } = req.query;
    const searchValue = req.query.searchValue;
    const { limit, offset } = getPagination(page, size);

    if (searchValue) {
      const groups = await db.groupSkills.findAndCountAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${searchValue}%` } }],
        },
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(groups, page, limit));
    } else {
      const groups = await db.groupSkills.findAndCountAll({
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(groups, page, limit));
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const getGroupById = async(req,async)=> {
    try{
const {groupId} = req.params;
const group = await db.groupSkills.findOne({
    where : {id : groupId}
})
if(group){
    return res.status(200).json({group})
}else{
    return res.status(404).send(' group does not exists')
}
    }
    catch{
 return res.status(500).json({error: error.message})
    }

}



/**
 * ? update a groupSkill
 * @swagger
 * /groupSkills/{id}:
 *  put:
 *   summary: Updates group skill by id
 *   tags: [skills]
 *   parameters:
 *      - in : path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example:  group skill name
 *
 *   responses:
 *     200:
 *       description: Updates group skill by id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/groupSkills'
 *
 */

const updateGroup = async (req, res) => {

    try {

      const { groupId } = req.params;
      const [ updatedGroup ] = await db.groupSkills.update(req.body, {
      where: { id: groupId }
      });
      if (updatedGroup) {
        const updateGroup = await db.groupSkills.findOne({ where: { id: groupId } });
        return res.status(200).json({ type: updateGroup });
      }
      throw new Error('group Skills not found');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };


   /**
 * @swagger
 * /groupSkills/{id}:
 *  delete:
 *   summary: Deletes a  group skills
 *   tags: [groupSkills]
 *
 *   parameters:
 *      - in : path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *
 *   responses:
 *     204:
 *       description: Deletes a group skill
 *     404:
 *       description: No group skill was found
 *
 */
    const deleteGroupSkills = async (req, res) => {
      const id = req.params.id;
     await db.groupSkills.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.status(204).json({ message: "group skill deleted " });
          } else {
            res.status(404).json({
              message: `Cannot delete group skill with id=${id}. Maybe group skill was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).json({
            message: "Could not delete group skill "
          
          })});}




          /**
 * ? update a group skill
 * @swagger
 * /groupSkills/{id}:
 *  put:
 *   summary: Updates group skill by id
 *   tags: [groupSkills]
 *   parameters:
 *      - in : path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example:  group skill name
 *
 *   responses:
 *     200:
 *       description: Updates group skill by id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/groupSkills'
 *
 */

const updateGroupSkill= async (req, res) => {

  try {

    const { groupSkillId } = req.params;
    const [ updatedGroupSkill ] = await db.groupSkills.update(req.body, {
    where: { id: groupSkillId }
    });
    if (updatedGroupSkill) {
      const updatedGroupSkill = await db.groupSkills.findOne({ where: { id: groupSkillId } });
      return res.status(200).json({ groupSkill: updatedGroupSkill });
    }
    throw new Error('group skill not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};




const updateSkill= async (req, res) => {

    try {

      const { skillId } = req.params;
      const [ updatedSkill ] = await db.skills.update(req.body, {
      where: { id: skillId }
      });
      if (updatedSkill) {
        const updatedSkill = await db.skills.findOne({ where: { id: skillId } });
        return res.status(200).json({ skill: updatedSkill });
      }
      throw new Error('skill not found');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

const addSkillToGroupSkills = async (req, res, next) => {
  try {
    const { groupSkillId } = req.body;
    const {skillId} = req.body
    const skill = await db.skills.findByPk(skillId) 
    const groupSkill = await db.groupSkills.findByPk(groupSkillId) 
    if (!groupSkill) {
      return res.send("you need to provide the correct group Skill id");
    }
    if (!skill) {
      return res.send("you need to provide the correct skill id");
    }
    const result = await groupSkill.addSkill(skill, {
      through: { selfGranted: true },
    });
    if (result.toString() === "0")
      return res
        .status(400)
        .json({ message: "this skill is already affected to this groupSkills" });
    res.send("skill affected to group Skills");
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
    createGroupSkills,
    getAllGroupSkills,
    getGroupById,
    updateGroupSkill,
    deleteGroupSkills,
    addSkillToGroupSkills,
    getAllGroupSkillsWithPagination
}
