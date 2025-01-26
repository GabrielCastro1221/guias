const { Router } = require("express");
const TourController = require("../controllers/tour.controller");
const upload = require("../middlewares/upload.middleware");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const tour = new TourController();
const auth = new AuthMiddleware();

router.post(
  "/",
  upload.fields([
    { name: "mainImg", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  tour.createTour
);

router.get("/", tour.getAllTours);
router.get("/:id", tour.getTourById);

router.put("/:id", tour.updateTour);

router.delete("/:id", tour.deleteTour);

module.exports = router;
