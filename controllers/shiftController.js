
const db = require('../utils/initializeDataBase');
const router = require('express').Router();
const {Op}  = require("@sequelize/core")

/**
 * @swagger
 * components:
 *   schemas:
 *     shifts:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the instance (project)
 *         startDate:
 *           type: date
 *           description: The startDate
 *         endDate:
 *           type: date
 *           description: The endDate
 *        
 *
 *       example:
 *         startDate: "2022-05-01"
 *         endDate: "2022-05-01"
 */

/**
 * @swagger
 * /shifts/:
 *  post:
 *   summary: Creates a new shift
 *   tags: [shifts]
 *
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/shifts'
 *
 *   responses:
 *     201:
 *       description: Creates a new shift
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/shifts'
 *
 */

const createShift = async(req,res) => {

  const selectedGroupSkills = req.body.selectedGroupSkills  
    let groupSkills = []
    selectedGroupSkills.forEach(groupSkillItem => {
    groupSkills = [...groupSkills,...groupSkillItem.skills.map(skill => {return {...skill,groupId:groupSkillItem.groupId}})]
  
        })

    
    try{
   const shift = await db.shift.create({startDate: req.body.startDate,endDate:req.body.endDate,typeId:req.body.typeId})
   
   const skillList = await db.skills.findAll({where:{id:{[Op.in]:groupSkills.map(gs => gs.skillId)}}})
   groupSkills.forEach(async gs => {
    if (gs.effectif> 0)
    await db.shiftSkills.create({groupSkillId:gs.groupId,skillId:gs.skillId,effectif :gs.effectif,shiftId:shift.id})
   })

   console.log(skillList)
       return res.status(201).json(
          shift,
        ); 
   

 

   

    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}












/**
 * @swagger
 * /shifts:
 *   get:
 *     tags: [shifts]
 *     description: Get all shifts
 *     responses:
 *       200:
 *         description: Success
 *
 */

const getAllShifts = async (req,res) => {
    try{
  const shifts = await db.shift.findAll({include:{all:true}});
  // console.log(shifts)
  res.status(200).json(shifts)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}



const getShiftById = async(req,res,async)=> {
    try{
const {shiftId} = req.params;
const shifts = await db.affectation.findAll({
    where : { shiftId},
    include:[{association: "shift", include :{all: true}} ,{association:"user"} ]                    
    
}
)
let shiftSkills = await db.shiftSkills.findAll({
  where : {shiftId : shiftId} ,
  include:{all:true}
})
if(shifts.length > 0 && shiftSkills.length > 0){
    let shift = {...shifts[0].shift.dataValues,users:shifts.map(elem =>elem.dataValues.user),groupSkills:shiftSkills.map(elem => elem.groupSkills)}
console.log(shift)
    return res.status(200).json({shift})
}else{  
    return res.status(200).send({shift:{...shiftSkills[0].shift,users:[]}})
}
    }
    catch(error){

 return res.status(500).json({error: error.message})
    }

}


/**
 * ? update a shift
 * @swagger
 * /shifts/{id}:
 *  put:
 *   summary: Updates shift by id
 *   tags: [shifts]
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
 *              startDate:
 *                  type: date
 *                  example:  2022-05-01
 *              endDate:
 *                  type: date
 *                  example: 2022-05-01
 *
 *   responses:
 *     200:
 *       description: Updates shift by id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/shifts'
 *
 */

const updateShift = async (req, res) => {

    try {

      const { shiftId } = req.params;
      const {userIds} = req.body
      userIds.forEach(async userId => {
        await db.affectation.findOrCreate({where:{shiftId,userId}})
      })


      
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };


/**
 * @swagger
 * /shifts/{id}:
 *  delete:
 *   summary: Deletes a shift
 *   tags: [shifts]
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
 *       description: Deletes a shift
 *     404:
 *       description: No shift was found
 *
 */

const deleteShift = async (req, res) => {
  const id = req.params.id;
 await db.shift.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(204).json({ message: "shift deleted " });
      } else {
        res.status(404).json({
          message: `Cannot delete shift with id=${id}. Maybe shift was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not delete shift "
      
      })});}

const affectUserToShift = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const shift = await db.shift.findByPk(req.body.shiftId) 
    
    
    const user = await db.user.findByPk(userId) 
   
    if (!shift) {
      return res.send("you need to provide the correct shift id");
    }
    if (!user) {
      return res.send("you need to provide the correct user id");
    }
    const result = await shift.addUser(user, {
      through: { selfGranted: true },
    });
    if (result.toString() === "0")
      return res
        .status(400)
        .json({ message: "this user is already affected to shift" });
    res.send("user affected to shift");
  } catch (err) {
    console.log(err);
  }
};





module.exports = {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift,
    affectUserToShift
}
