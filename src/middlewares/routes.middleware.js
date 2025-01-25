const viewsRouter = require("../routes/views.routes");
const uploadRouter = require("../routes/upload.routes");
const authRouter = require("../routes/auth.routes");
const userRouter = require("../routes/user.routes");
const guideRouter = require("../routes/guide.routes");
const postRouter = require("../routes/post.routes");
const tourRouter = require("../routes/tour.routes");

const setupRoutes = (app) => {
  app.use("/", viewsRouter);
  app.use("/api/v1", uploadRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/guides", guideRouter);
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1/tour", tourRouter);
};

module.exports = setupRoutes;
