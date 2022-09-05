const express = require("express");
const fs = require("fs")
const http = require("http");

const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJSDOC = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const db = require("./utils/initializeDataBase");
sendEmail = require("./utils/sendEmail")
const routes = require('./routes');

app.use(cors(
//   {
//     origin: 'https//localhost:3000'
// }
));
app.use(bodyParser.json());
app.use("/",routes);
// sendEmail()

const server = http.createServer({
  key: fs.readFileSync( "./cert/key.pem"),
  cert: fs.readFileSync( "./cert/cert.pem"),
}, app);

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
          url : 'https://localhost:5000'
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
server.listen(5000, () => {
  console.log("strat app");
});

module.exports = app;