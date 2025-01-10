const guideModel = require("../models/guides.model");

class GuideController {
  getAllGuides = async (req, res) => {
    try {
      const guides = await guideModel.find({});
      if (guides.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No hay guias por el momento" });
      }
      res.status(200).json({
        status: true,
        message: "guias encontrados con éxito",
        usuarios: guides,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los guias",
        error: err.message,
      });
    }
  };

  getGuideById = async (req, res) => {
    const { id } = req.params;
    try {
      const guide = await guideModel.findById(id);
      if (guide.length === 0) {
        res.status(404).json({
          status: false,
          message: `Guia no encontrado`,
        });
      }
      res.status(200).json({
        status: true,
        message: `Guia encontrado con exito`,
        usuario: guide,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Error al obtener el guia`,
        error: err.message,
      });
    }
  };

  updateGuide = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedGuide = await guideModel.findByIdAndUpdate(
        id,
        { $set: { ...req.body } },
        { new: true }
      );
      if (!updatedGuide) {
        return res.status(404).json({
          status: false,
          message: "Guia no encontrado",
        });
      }
      res.status(200).json({
        status: true,
        message: "Guia actualizado con exito",
        guia: updatedGuide,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar el guia",
        error: err.message,
      });
    }
  };
  

  deleteGuide = async (req, res) => {
    const { id } = req.params;
    try {
      const guide = await guideModel.findByIdAndDelete(id);
      if (guide.length === 0) {
        res.status(404).json({
          status: false,
          message: `Guia no encontrado`,
        });
      }
      res.status(200).json({
        status: true,
        message: `Guia eliminado con exito`,
        usuario: guide,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Error al eliminar el guia`,
        error: err.message,
      });
    }
  };

  async getGuideProfile(req, res) {
    const guideId = req.user ? req.user._id : null;
    try {
      const guide = await guideModel.findById(guideId).select("-password");
      if (!guide) {
        return res.status(404).json({
          success: false,
          message: "Guia no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        message: "Información del perfil obtenida exitosamente",
        data: guide,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la información del perfil",
      });
    }
  }

  changeApprovalStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const guide = await guideModel.findById(id);
      if (!guide) {
        return res.status(404).json({
          success: false,
          message: "Guia no encontrado",
        });
      }
      const updatedGuide = await guideModel.findByIdAndUpdate(
        id,
        { isApproved: "aprobado" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "aprobado"`,
        data: updatedGuide,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };

  cancelledStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const guide = await guideModel.findById(id);
      if (!guide) {
        return res.status(404).json({
          success: false,
          message: "Guide no encontrado",
        });
      }
      const updatedGuide = await guideModel.findByIdAndUpdate(
        id,
        { isApproved: "cancelado" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "cancelado"`,
        data: updatedGuide,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };
}
module.exports = GuideController;
