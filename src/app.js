const express = require("express");
const app = express();
require("./config/connection.config");
const bodyParserMiddleware = require("./middlewares/bodyParser.middleware");
const handlebarsMiddleware = require("./middlewares/handlebars.middleware");
const serverMiddleware = require("./middlewares/server.middleware");
const setupRoutes = require("./middlewares/routes.middleware");

bodyParserMiddleware(app);
handlebarsMiddleware(app);
setupRoutes(app);
serverMiddleware(app);