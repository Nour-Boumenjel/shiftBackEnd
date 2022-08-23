const db = require('../utils/initializeDataBase');
const createType = async(req,res)=> {
    try{
    const type = await db.type.create(req.body)
       return res.status(201).json({
        type,
    });
    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}

const getAllTypes = async (req,res) => {
    try{
  const types = await db.type.findAll();
  res.status(200).json(types)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}



const getTypeById = async(req,res,async)=> {
try{
const {typeId} = req.params;
const type = await db.type.findOne({
    where : {id : typeId}
})
if(type){
    return res.status(200).json({type})
}else{
    return res.status(404).send(' type does not exists')
}
    }
    catch{
 return res.status(500).json({error: error.message})
    }

}




const updateType= async (req, res) => {

    try {

      const { typeId } = req.params;
      const [ updatedType ] = await db.type.update(req.body, {
      where: { id: typeId }
      });
      if (updatedType) {
        const updatedType = await db.type.findOne({ where: { id: typeId } });
        return res.status(200).json({ type: updatedType });
      }
      throw new Error('type not found');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };


  
const deleteType = async (req, res) => {
    const id = req.params.id;
     await db.types.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.status(204).json({ message: "type deleted " });
        } else {
          res.status(404).json({
            message: `Cannot delete type with id=${id}. Maybe type was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "Could not delete type with id=" + id
        
        })});}

       
      




module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    updateType,
    deleteType,
}
