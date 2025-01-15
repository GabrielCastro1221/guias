const { logger } = require("./logger.middleware");
const configObject = require("../config/env.config");
const socketMiddleware = require("../middlewares/socket.middleware");

const serverListenMiddleware = (app) => {
  const server = app.listen(configObject.server.port, () => {
    try {
      logger.info(
        `Servidor escuchando en el puerto ${configObject.server.port} y ejecutándose en la URL http://localhost:${configObject.server.port}`
      );
    } catch (err) {
      logger.error("Error interno del servidor", err.message);
    }
  });

  socketMiddleware(server);
};

module.exports = serverListenMiddleware;
