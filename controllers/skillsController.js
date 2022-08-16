
const db = require('../utils/initializeDataBase');

/**
 * @swagger
 * components:
 *   schemas:
 *     skills:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the instance (project)
 *         name:
 *           type: string
 *           description: The skill name
 *        
 *
 *       example:
 *         name: "Front end"
 */

/**
 * @swagger
 * /skills/:
 *  post:
 *   summary: Creates a new skill
 *   tags: [skills]
 *
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/skills'
 *
 *   responses:
 *     201:
 *       description: Creates a new skill
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/skills'
 *
 */

const createSkills = async(req,res)=> {
    try{
    const skill = await db.skills.create(req.body)
       return res.status(201).json(
        skill,
    );
    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}

/**
 * @swagger
 * /skills:
 *   get:
 *     tags: [skills]
 *     description: Get all skills
 *     responses:
 *       200:
 *         description: Success
 *
 */

const getAllSkills = async (req,res) => {
    try{
  const skills = await db.skills.findAll();
  res.status(200).json(skills)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}



const getSkillById = async(req,async)=> {
    try{
const {skillId} = req.params;
const shift = await db.skills.findOne({
    where : {id : skillId}
})
if(skill){
    return res.status(200).json({skill})
}else{
    return res.status(404).send(' skill does not exists')
}
    }
    catch{
 return res.status(500).json({error: error.message})
    }

}

/**
 * ? update a skill
 * @swagger
 * /skills/{id}:
 *  put:
 *   summary: Updates skill by id
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
 *                  example:  skill name
 *
 *   responses:
 *     200:
 *       description: Updates skill by id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/skills'
 *
 */

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

  


  /**
 * @swagger
 * /skills/{id}:
 *  delete:
 *   summary: Deletes a skill
 *   tags: [skills]
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
 *       description: Deletes a skill
 *     404:
 *       description: No skill was found
 *
 */

const deleteSkill = async (req, res) => {
    const id = req.params.id;
   await db.skills.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.status(204).json({ message: "skill deleted " });
        } else {
          res.status(404).json({
            message: `Cannot delete skill with id=${id}. Maybe skill was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete skill with id=" + id
        
        })});}
      
  


module.exports = {
    createSkills,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill,
}
