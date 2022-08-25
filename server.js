const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJSDOC = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const app = express();
const db = require("./utils/initializeDataBase")
// const sendEmail = require("./utils/sendEmail")
const routes = require('./routes');

const http = require("http");
app.use(cors());
app.use(bodyParser.json());
app.use("/",routes)

//  sendEmail()


const server = http.createServer(app);


server.listen(5000, () => {
  console.log("strat app");
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shift-react management API',
      version: '1.0.0',
      description: `<i>Group of endpoints that manage the CRUD operations for shift-react</i>`,
      contact: {},
      
      servers: [
        {
          url : 'http://localhost:5000'
        }
      ],
    },
  },
  apis: [
    
    "./controllers/*.js",
  ],
};
const swaggerDocs = swaggerJSDOC(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;