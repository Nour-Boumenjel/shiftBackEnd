/**
 * ? create a pool
 * @swagger
 * /pools/:
 *  post:
 *   summary: Creates a new pool
 *   tags: [index]
 *
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  example: SAP Team
 *   responses:
 *     200:
 *       description: Creates a new pool
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             $ref: '#/components/schemas/pool'
 *
 */

/**
 * ? get all pools in the database
 * @swagger
 * /pools/:
 *   get:
 *     tags: [index Route]
 *     description: Get all pools
 *     responses:
 *       200:
 *         description: Success
 *
 */

/**
 * ? get pool by id
 * @swagger
 * /pool/{id}:
 *  get:
 *    summary: Returns the pool by id
 *    tags: [index Route]
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
 *              type: object
 *              $ref: '#/components/schemas/pool'
 *      404:
 *        description: No pool exist with this id
 *
 */

/**
 * ? update a pool
 * @swagger
 * /pool/{id}:
 *  patch:
 *   summary: Updates pool by id
 *   tags: [pool Routes]
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
 *                  example: SAP
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

/**
 * @swagger
 * /pool/{id}:
 *  delete:
 *   summary: Deletes a pool
 *   tags: [pool Routes]
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