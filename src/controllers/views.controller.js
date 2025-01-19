const guideModel = require("../models/guides.model");
const postModel = require("../models/post.model");
const tourModel = require("../models/tour.model");

class ViewsManager {
  renderpageNotFound = (req, res) => {
    try {
      res.render("pageNotFound");
    } catch (err) {
      res.send("Error al renderizar la pagina de error 404");
    }
  };

  renderHome = (req, res) => {
    try {
      res.render("home");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderLogin = (req, res) => {
    try {
      res.render("login");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderRegister = (req, res) => {
    try {
      res.render("register");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderUserProfile = (req, res) => {
    try {
      res.render("userProfile");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderGuideProfile = (req, res) => {
    try {
      res.render("guideProfile");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderAdminProfile = (req, res) => {
    try {
      res.render("adminProfile");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderTours = async (req, res) => {
    try {
      const tour = await tourModel.find({ isApproved: "aprobado" }).lean();
      if (!tour || tour.length === 0) {
        return res.render("tours", {
          guias: null,
          message: "Lo sentimos, No hay tours disponibles en este momento...",
        });
      }
      res.render("tours", { tour });
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderTourDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const tour = await tourModel.findById(id).lean();
      if (!tour) {
        return res.status(404).render("pageNotFound", {
          message: "Tour no encontrado",
        });
      }
      res.render("tourDetail", { tour });
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderGuides = async (req, res) => {
    try {
      const guide = await guideModel.find({ isApproved: "aprobado" }).lean();
      if (!guide || guide.length === 0) {
        return res.render("guides", {
          guias: null,
          message: "Lo sentimos, No hay guias disponibles en este momento...",
        });
      }
      res.render("guides", { guide });
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderGuidesDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const guide = await guideModel.findById(id).lean();
      if (!guide) {
        return res.status(404).render("pageNotFound", {
          message: "Guia no encontrado",
        });
      }
      res.render("guidesDetail", { guide });
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderBlog = (req, res) => {
    try {
      res.render("blog");
    } catch (err) {
      res.render("pageNotFound");
    }
  };

  renderPost = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await postModel.findById(id).lean();
      if (!post) {
        return res.status(404).render("pageNotFound", {
          message: "Publicación no encontrada",
        });
      }
      res.render("postDetail", {
        title: post.title_one,
        title_two: post.title_two,
        description: post.desc_one,
        description_two: post.desc_two,
        imageUrl: post.img,
      });
    } catch (err) {
      console.error("Error al obtener la publicación:", err);
      res.status(500).render("pageNotFound", {
        message: "Error interno del servidor",
      });
    }
  };

  renderChat = (req, res) => {
    try {
      res.render("chat");
    } catch (err) {
      res.render("pageNotFound");
    }
  };
 
  renderConfirmEmail = (req, res) => {
    try {
      res.render("emailConfirm");
    } catch (err) {
      res.render("pageNotFound");
    }
  };
  
  renderResetPass = (req, res) => {
    try {
      res.render("resetPass");
    } catch (err) {
      res.render("pageNotFound");
    }
  };
  
  renderChangePass = (req, res) => {
    try {
      res.render("ChangePass");
    } catch (err) {
      res.render("pageNotFound");
    }
  };
}

module.exports = ViewsManager;
