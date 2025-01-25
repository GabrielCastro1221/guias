const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const user = new UserController();
const auth = new AuthMiddleware();

router.get("/", user.getAllUsers);
router.get(
  "/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.getUserById
);
router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.getUserProfile
);

router.put(
  "/:id",
  upload.single("photo"),
  auth.authenticate,
  auth.restrict(["usuario"]),
  user.updateUser
);
router.put(
  "/admin/:id",
  auth.authenticate,
  auth.restrict(["admin"]),
  user.changeRolAdmin
);

router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.deleteUser
);

module.exports = router;
