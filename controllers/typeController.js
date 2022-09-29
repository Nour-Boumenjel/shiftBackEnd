const db = require('../utils/initializeDataBase');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

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

const createType = async(req,res)=> {
    try{
    const type = await db.type.create(req.body)
       return res.status(201).json(
        type,
    );
    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}





const getAllTypeWithPagination = async (req, res) => {
  try {
    const { page, size } = req.query;
    const searchValue = req.query.searchValue;
    const { limit, offset } = getPagination(page, size);

    if (searchValue) {
      const types = await db.type.findAndCountAll({
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${searchValue}%` } }],
        },
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(types, page, limit));
    } else {
      const types = await db.type.findAndCountAll({
        include: { all: true },
        limit,
        offset,
      });

      res.status(200).json(getPagingData(types, page, limit));
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

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
 await db.type.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(204).json({ message: "type deleted " });
      } else {
        res.status(404).json({
          message: `Cannot delete type Maybe type was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not delete type " 
      
      })});}

       
      




module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    updateType,
    deleteType,
    getAllTypeWithPagination
}
