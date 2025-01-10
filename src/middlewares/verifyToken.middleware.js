const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const guideModel = require("../models/guides.model");
const configObject = require("../config/env.config");

class AuthMiddleware {
  authenticate = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Autorización denegada. No se proporcionó token.",
      });
    }
    try {
      const token = authToken.split(" ")[1];
      const decoded = jwt.verify(token, configObject.auth.jwt_secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "El token de acceso ha expirado.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token inválido.",
      });
    }
  };

  restrict = (roles) => async (req, res, next) => {
    try {
      const userId = req.user.id;
      let user;
      const usuario = await userModel.findById(userId);
      const guide = await guideModel.findById(userId);

      if (usuario) {
        user = usuario;
      } else if (guide) {
        user = guide;
      }
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado.",
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para acceder a esta ruta.",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error en la verificación de roles.",
      });
    }
  };
}

module.exports = AuthMiddleware;
