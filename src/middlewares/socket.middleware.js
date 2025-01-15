const socketIO = require("socket.io");
const { logger } = require("./logger.middleware");

const socketMiddleware = (server) => {
  const io = socketIO(server);
  let socketsConected = new Set();

  io.on("connection", (socket) => {
    logger.info("Socket connected", socket.id);
    socketsConected.add(socket.id);
    io.emit("clients-total", socketsConected.size);

    socket.on("disconnect", () => {
      logger.info("Socket disconnected", socket.id);
      socketsConected.delete(socket.id);
      io.emit("clients-total", socketsConected.size);
    });

    socket.on("message", (data) => {
      socket.broadcast.emit("chat-message", data);
    });

    socket.on("feedback", (data) => {
      socket.broadcast.emit("feedback", data);
    });
  });
};

module.exports = socketMiddleware;
