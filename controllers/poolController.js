
const db = require('../utils/initializeDataBase');
const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     pool:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the instance (project)
 *         name:
 *           type: string
 *           description: The pool name
 *        
 *
 *       example:
 *         name: "SAP Team"
 */

/**
 * @swagger
 * /pool/:
 *  post:
 *   summary: Creates a new pool
 *   tags: [pool]
 *
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/pool'
 *
 *   responses:
 *     201:
 *       description: Creates a new pool
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/pool'
 *
 */

const createPool = async(req,res)=> {
    try{
    const pool = await db.pool.create(req.body)
       return res.status(201).json(
      pool,
    );
    }
    catch(error){
        return res.status(500).json({error: error.message})

    }
}

/**
 * @swagger
 * /pools:
 *   get:
 *     tags: [pool]
 *     description: Get all pools
 *     responses:
 *       200:
 *         description: Success
 *
 */
 
const getAllPools = async (req,res) => {
    try{
  const pools = await db.pool.findAll();
  res.status(200).json(pools)
    }
    catch(error) {
   return res.status(500).json({error: error.message})
    }
}

/**
 * @swagger
 * /Pool/{id}:
 *  get:
 *    summary: Returns the list of pool by id
 *    tags: [pool]
 *    parameters:
 *      - in : path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 
 *    responses:
 *      200:
 *        description: The list of pool by id
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/pool'
 *      404:
 *        description: no pool
 *
 */
/* i must fix this controller */
const getPoolById = async(req,res,async)=> {
    try{
const {poolId} = req.params;
const pool = await db.pool.findOne({
    where : {id : poolId}
})
if(pool){
    return res.status(200).json({pool})
}else{
    return res.status(404).send(' pool does not exists')
}
    }
    catch{
 return res.status(500).json({error: error.message})
    }

}

/**
 * ? update a pool
 * @swagger
 * /pool/{id}:
 *  put:
 *   summary: Updates pool by id
 *   tags: [pool]
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
 *                  example: another pool name
 *
 *   responses:
 *     200:
 *       description: Updates pool by id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/pool'
 *
 */

//  const updatePool = async (req, res) => {
//   const id = req.params.id;
//   await db.pool.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.status(200).send({ msg: "pool updated" });
//       } else {
//         res.send({
//           message: `Cannot update pool with id=${id}. Maybe pool was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating pool with id=" + id
//       });
//     });
// };

// i have changed type:updatePool to pool:updatePool
const updatePool = async (req, res) => {

   try {

     const { PoolId } = req.params;
      const [ updatedPool  ]= await db.pool.update(req.body, {
       where: { id: PoolId }
     });
      if (updatedPool) {
         const updatePool = await db.pool.findOne({ where: { id: PoolId } });
         return res.status(200).json({ pool: updatePool });
      }
       throw new Error('Pool  not found');
     } catch (error) {
      return res.status(500).send(error.message);
     }
   };


/**
 * @swagger
 * /pool/{id}:
 *  delete:
 *   summary: Deletes a pool
 *   tags: [pool]
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
 *       description: Deletes a pool
 *     404:
 *       description: No pool was found
 *
 */

 const deletePool = async (req, res) => {
  const id = req.params.id;
 await db.pool.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(204).json({ message: "pool deleted " });
      } else {
        res.status(404).json({
          message: `Cannot delete pool with id=${id}. Maybe pool was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete pool with id=" + id
      
      })});}
    






// const deletePool = async(req, res)=> {
//     try{
//     const poolId = req.params;
//     const deletedPool = await db.pool.destroy({where: {id : poolId}})
//     res.status(204).json({ message: "pool deleted " });
//     }
//     catch(error) {
//     return res.status(500).json({error})
//     }
// }


const addMemberToPool = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const {poolId} = req.body
    const pool = await db.pool.findByPk(poolId) 
    const user = await db.user.findByPk(userId) 
    if (!user) {
      return res.send("you need to provide the correct user id");
    }
    if (!pool) {
      return res.send("you need to provide the correct pool id");
    }
    const result = await pool.addUser(user, {
      through: { selfGranted: true },
    });
    if (result.toString() === "0")
      return res
        .status(400)
        .json({ message: "this member is already affected to this pool" });
    res.send("member affected to the pool");
  } catch (err) {
    console.log(err);
  }
};



module.exports = {
    createPool,
    getAllPools,
    getPoolById,
    updatePool,
    deletePool,
    addMemberToPool,
}
