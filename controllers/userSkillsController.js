
const { assignAlgoMax } = require('../utils/algorithm');
const db = require('../utils/initializeDataBase');
const router = require('express').Router();



const getSkillsByUser = async (req,res) => {
    try{
  const {userId} = req.body;
  const skills = await db.userSkills.findAll({
    where : {userId : userId}},
  );
  res.status(200).json(skills)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}

const getBestSuggestion = async (req,res)=>{
  try {
    const listUserSkills = await db.userSkills.findAll();
    let userWithSkills = listUserSkills.map(elem => elem.userId)
   userWithSkills =   [... new Set(userWithSkills)]
    console.log(userWithSkills)
    const mappedUserIndex = userWithSkills.reduce((result,filter,index) =>{
      result[index] = filter
      return result
    },{})
   
    console.log(mappedUserIndex)
    let skills = listUserSkills.map(elem=> elem.skillId)
    skills =   [... new Set(skills)]
    const mappedSkillIndex = skills.reduce((result,filter,index) =>{
      result[index] = filter
      return result
    },{})
    let finalList = userWithSkills.map(user => {
      return skills.map(skill => {
        return listUserSkills.find(el =>{
          
          return el.dataValues.userId == user && el.skillId == skill
        })?parseInt(listUserSkills.find(el =>{
          
          return el.dataValues.userId == user && el.skillId == skill
        }).dataValues.niveau):0
      })
    })
    finalList = assignAlgoMax(finalList)
   finalList =  finalList.map(elem => {
      elem[0] = mappedUserIndex[elem[0].toString()]
      elem[1] = mappedSkillIndex[elem[1].toString()]
      return elem
    })
    
    res.status(200).json({finalList })
  }catch(err){
    console.log(err)
  }
}

module.exports = {
  
    getSkillsByUser,
    getBestSuggestion
}
