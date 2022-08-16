
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
  //  console.log(req.body)
  //  console.log(groupSkills)
    
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
    // const result = await shift.addSkill(groupSkills, {
    //   through: { selfGranted: true },
    // });
    // if (result.toString() === "0")
    //   return res
    //     .status(400)
    //     .json({ message: "this skill is already affected to shift" });
    // res.send("skill affected to shift");

 

   

    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}



// const createShift = async(req,res) => {
//   try{
      // const selectedGroupSkills = req.body.selectedGroupSkills
  // console.log(req.body)
//   const shift = await db.shift.create({startDate: req.body.startDate,endDate:req.body.endDate,typeId:req.body.typeId})
    //  const shift = await db.shift.findByPk(shift.shiftId)
    // if (!shift) {
    //   return res.send("you need to provide the correct shift id");
    // }
    // const groupSkills = []
    //   selectedGroupSkills.foreach(groupSkillItem => {
    //   groupSkills = [...groupSkills,...groupSkillItem.skills]
    //   })
    //   console.log(groupSkills)
    // const result = await shift.addSkill(idShift,Skills,{
    //   through: { selfGranted: true },  
    // })
//      return res.status(201).json(
//     shift,
//   );
//   }
//   catch(error){
//       return res.status(500).json({error: error.message})

//   }
// }








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
const shift = await db.shift.findOne({
    where : {id : shiftId},
    include:{all:true}                      
    
}

)
if(shift){
    return res.status(200).json({shift})
}else{  
    return res.status(404).send(' shift does not exists')
}
    }
    catch{

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
      const [ updatedShift ] = await db.shift.update(req.body, {
      where: { id: shiftId }
      });
      if (updatedShift) {
        const updatedShift = await db.shift.findOne({ where: { id: shiftId } });
        return res.status(200).json({ shift: updatedShift });
      }
      throw new Error('shift not found');
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
/**fix this */
// const deleteShift = async (req, res) => {
//   const id = req.params.id;
//  await db.shifts.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.status(204).json({ message: "shift deleted " });
//       } else {
//         res.status(404).json({
//           message: `Cannot delete shift with id=${id}. Maybe shift was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete shift with id=" + id
      
//       })});}
    

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
      res.status(500).send({
        message: "Could not delete shift with id=" + id
      
      })});}

const affectUserToShift = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const shift = await db.shift.findByPk(req.body.shiftId) 
    // const startDate = new Date(req.body.startDate);
    // const endDate = new Date(req.body.endDate)
    // const shift = await db.shift.create({startDate,endDate}) 
    
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







// const affectSkillToShift = async (req, res, next) => {
//   try {
//     const { skillId } = req.body;
//     const shift = await db.shift.findByPk(req.body.shiftId) 
//     // const startDate = new Date(req.body.startDate);
//     // const endDate = new Date(req.body.endDate)
//     //  const shift = await db.shift.create({startDate,endDate}) 
    
//     const user = await db.user.findByPk(userId) 
   
//     if (!shift) {
//       return res.send("you need to provide the correct shift id");
//     }
//     if (!user) {
//       return res.send("you need to provide the correct user id");
//     }
//     const result = await shift.addUser(user, {
//       through: { selfGranted: true },
//     });
//     if (result.toString() === "0")
//       return res
//         .status(400)
//         .json({ message: "this user is already affected to shift" });
//     res.send("user affected to shift");
//   } catch (err) {
//     console.log(err);
//   }
// };



module.exports = {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift,
    affectUserToShift
}