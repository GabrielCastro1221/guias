const tourModel = require("../models/tour.model");
const guideModel = require("../models/guides.model");
const MailerManager = require("../services/nodemailer.services");

const mailer = new MailerManager();

class TourController {
  createTour = async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        guideId,
        location,
        category,
      } = req.body;
      
      const requiredFields = [
        title,
        description,
        price,
        guideId,
        location,
        category,
      ];
      if (requiredFields.includes(undefined) || requiredFields.includes(null) || requiredFields.includes("")) {
        return res.status(400).json({
          status: false,
          message: "Todos los campos son obligatorios",
        });
      }

      const mainImg = req.files["mainImg"]?.[0]?.path;
      const photos = req.files["photos"]?.map((file) => file.path) || [];
  
      const guideExists = await guideModel.findById(guideId);
      if (!guideExists) {
        return res.status(404).json({
          status: false,
          message: "El guía especificado no existe",
        });
      }
  
      const newTour = new tourModel({
        title,
        description,
        img: mainImg,
        photo: photos,
        price,
        guide: guideId,
        location,
        category,
        status: "aporte",
      });
      await newTour.save();
  
      await guideModel.findByIdAndUpdate(guideId, {
        $push: { tours: newTour._id },
      });
  
      const tourData = {
        title,
        location,
        price,
        guideId,
      };
      await mailer.enviarCorreoNotificacionTourCreado(tourData);
  
      res.status(201).json({
        status: true,
        message: "Tour creado con éxito",
        renta: newTour,
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

      res.status(200).json({
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

  deleteTour = async (req, res) => {
    const { id } = req.params;
    try {
      const tour = await tourModel.findByIdAndDelete(id);

      if (!tour) {
        res.status(404).json({ status: false, message: "Tour no encontrado" });
      }

      res
        .status(200)
        .json({
          status: true,
          message: "Tour eliminado con exito",
          tour: tour,
        });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar el tour, intenta nuevamente",
        error: err.message,
      });
    }
  };
}

module.exports = TourController;
