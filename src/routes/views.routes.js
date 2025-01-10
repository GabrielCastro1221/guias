const { Router } = require("express");
const ViewsManager = require("../controllers/views.controller");

const router = Router();
const views = new ViewsManager();

router.get("/pagina-no-encontrada", views.renderpageNotFound);
router.get("/", views.renderHome);
router.get("/login", views.renderLogin);
router.get("/registro", views.renderRegister);
router.get("/perfil-usuario", views.renderUserProfile);
router.get("/perfil-guia", views.renderGuideProfile);
router.get("/perfil-admin", views.renderAdminProfile);
router.get("/tours", views.renderTours);
router.get("/guias", views.renderGuides);
router.get("/guias/:id", views.renderGuidesDetail);
router.get("/blog", views.renderBlog);

module.exports = router;
