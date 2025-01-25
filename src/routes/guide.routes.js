const { Router } = require("express");
const GuideController = require("../controllers/guides.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const guide = new GuideController();
const auth = new AuthMiddleware();

router.get("/", guide.getAllGuides);
router.get("/:id", guide.getGuideById);
router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["guia"]),
  guide.getGuideProfile
);

router.put("/:id", guide.updateGuide);

router.put("/:id/approval-status", 
  auth.authenticate, 
  auth.restrict(["admin"]), 
  guide.changeApprovalStatus
);
router.put("/:id/cancelled-status", 
  auth.authenticate, 
  auth.restrict(["admin"]), 
  guide.cancelledStatus
);

router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["guia", "admin"]),
  guide.deleteGuide
);

module.exports = router;
