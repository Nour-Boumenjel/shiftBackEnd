
const db = require('../utils/initializeDataBase');
const {Op}  = require("@sequelize/core")
const getSkillsByShift = async(req,res,async)=> {
try{
const {shiftId} = req.params;
const shift = await db.shift.findByPk(shiftId) 

if(!shift){
    return res.send("shift does not exist");
}
let shiftSkills = await db.shiftSkills.findAll({
    where : {shiftId : shiftId} ,
    include:{all:true}
})
if(shiftSkills){
 let groups = []
shiftSkills.forEach((item) => {
    // console.log(item.shift)
      groups.push(item.groupSkill);
  });
  groups = groups.filter((group, index, arrayGroup) => {
    return arrayGroup.findIndex((item) => item.id === group.id) === index;
  });
   console.log(groups)
  shiftSkills.find((item) => item.shift.id.toString() === shiftId).dataValues.shift.dataValues.groupSkill = groups;
  shiftSkills
  .find((item) => item.shift.id.toString() === shiftId).dataValues
  .shift.dataValues.groupSkill.forEach((groupItem) => {
  groupItem.dataValues.skills = shiftSkills
  .filter((item) => item.groupSkill.id === groupItem.id)
  .map((item) => {return {...item.skill.dataValues,effectif:item.effectif}});
  });

  let skillsIds = shiftSkills.map(item=>{
    return item.dataValues.skillId
  })


  listSkills = await db.skills.findAll({
    include:{ model: db.user, as: 'users'},
    where  :{id:{[Op.in]:skillsIds}}
}
  )
  let allUser = []
  let listUsers = listSkills.forEach(elem=>{
     allUser = [...allUser,...elem.users.map(user => user.dataValues)] 
    })
    return res.status(200).json({shiftSkills,allUser})
    }
    else{
    return res.status(404).send(' Skills does not exist')
        }
    }
    catch(err){
        console.log(err)
    }

}

module.exports = {
    getSkillsByShift
}
