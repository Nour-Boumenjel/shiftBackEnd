
const db = require('../utils/initializeDataBase');


const deleteSkillFromGroupSkill = async (req, res) => {
   
    const groupSkillId = req.params.groupSkillId;
     const skillId = req.params.skillId;
   await db.skillsBelongsToGroupSkills.destroy({
      where: { skillId: skillId, groupSkillId: groupSkillId
     }
    })
      .then(num => {
        if (num == 1) {
          res.status(204).json({ message: "skill deleted from group" });
        } else {
          res.status(404).json({
            message: `Cannot delete skill from group Maybe skill was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete skill from group"
        
        })});}



module.exports = {
    
    deleteSkillFromGroupSkill
}
