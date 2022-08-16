
const db = require('../utils/initializeDataBase');


const getAllShiftUser = async (req,res) => {
    try{
  const users = await db.affectation.findAll({
    include : {all:true}}
  );
  res.status(200).json(users)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}


const deleteAffectation = async (req, res) => {
    // const id = req.params.id;
    const userId = req.params.userId;
     const shiftId = req.params.shiftId;
   await db.affectation.destroy({
      where: { shiftId: shiftId, userId: userId
     }
    })
      .then(num => {
        if (num == 1) {
          res.status(204).json({ message: "user deleted from shift" });
        } else {
          res.status(404).json({
            message: `Cannot delete user from shift Maybe user was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete user "
        
        })});}





module.exports = {
    getAllShiftUser,
    deleteAffectation
}
