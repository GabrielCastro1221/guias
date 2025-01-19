const tourModel = require("../models/tour.model");

class TourController {
  createTour = async (req, res) => {
    try {
      const { name, description, location, category, type, avaliables_dates } =
        req.body;

      const requiredFields = [
        name,
        description,
        location,
        category,
        type,
        avaliables_dates,
      ];

      if (
        requiredFields.includes(undefined) ||
        requiredFields.includes(null) ||
        requiredFields.includes("")
      ) {
        return res.status(400).json({
          status: false,
          message: "Todos los campos son obligatorios",
        });
      }

      const mainImg = req.files["mainImg"][0].path;
      const photos = req.files["photos"].map((file) => file.path);
      const newTour = new tourModel({
        name,
        description,
        img: mainImg,
        thumbnail: photos,
        location,
        category,
        type,
        avaliables_dates,
      });

      await newTour.save();
      res.status(200).json({
        status: true,
        message: "Tour creado con exito",
        tour: newTour,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al crear el tour, intenta nuevamente",
        error: err.message,
      });
    }
  };

  getAllTours = async (req, res) => {
    try {
      const tours = await tourModel.find({});

      if (!tours) {
        res
          .status(404)
          .json({ status: false, message: "Tours no encontrados" });
      }

      res.status(200).json({
        status: true,
        message: "Tours obtenidos con exito",
        tours: tours,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los tours, intenta nuevamente",
        error: err.message,
      });
    }
  };

  getTourById = async (req, res) => {
    const { id } = req.params;
    try {
      const tour = await tourModel.findById(id);

      if (!tour) {
        res.status(404).json({ status: false, message: "Tour no encontrado" });
      }

      res
        .status(200)
        .json({ status: true, message: "Tour obtenido con exito", tour: tour });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener el tour, intenta nuevamente",
        error: err.message,
      });
    }
  };

  updateTour = async (req, res) => {
    const { id } = req.params;
    try {
      const tour = await tourModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );

      if (!tour) {
        res.status(404).json({ status: false, message: "Tour no encontrado" });
      }

      res
        .status(200)
        .json({
          status: true,
          message: "Tour actualizado con exito",
          tour: tour,
        });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar el tour, intenta nuevamente",
        error: err.message,
      });
    }
  };

  deleteTour = async(req, res) => {
    const { id } = req.params;
    try {
      const tour = await tourModel.findByIdAndDelete(id);

      if (!tour) {
        res.status(404).json({ status: false, message: "Tour no encontrado" });
      }
      
      res
        .status(200)
        .json({ status: true, message: "Tour eliminado con exito", tour: tour });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar el tour, intenta nuevamente",
        error: err.message,
      });
    }
  }
}

module.exports = TourController;
