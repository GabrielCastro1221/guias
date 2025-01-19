const userModel = require("../models/user.model");
const guideModel = require("../models/guides.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configObject = require("../config/env.config");
const { createHash, isValidPassword } = require("../utils/hash.util");
const { generarResetToken } = require("../utils/resetToken");
const MailerManager = require("../services/nodemailer.services");

const mailer = new MailerManager();

class AuthController {
  generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      configObject.auth.jwt_secret,
      {
        expiresIn: "15d",
      }
    );
  };

  register = async (req, res) => {
    const {
      email,
      password,
      name,
      role,
      gender,
      phone,
      bio,
      about,
      specialization,
      education,
      experiences,
    } = req.body;

    const photo = req.file ? req.file.path : null;

    try {
      let user = null;

      if (role === "usuario") {
        user = await userModel.findOne({ email });
      } else if (role === "guia" || role === "admin") {
        user = await guideModel.findOne({ email });
      }

      if (user) {
        return res
          .status(400)
          .json({ message: `El usuario con el email ${email} ya existe!` });
      }

      if (role === "usuario") {
        user = new userModel({
          name,
          email,
          password: createHash(password),
          photo,
          gender,
          role,
        });
      } else if (role === "guia") {
        user = new guideModel({
          name,
          email,
          password: createHash(password),
          photo,
          gender,
          role,
          phone,
          bio,
          about,
          specialization,
          education,
          experiences,
        });
      } else if (role === "admin") {
        user = new userModel({
          name,
          email,
          password: createHash(password),
          photo,
          gender,
          role,
        });
      }
      await user.save();
      if (role === "guia") {
        await mailer.enviarCorreoBienvenidaGuia(email);
        await mailer.enviarCorreoNuevoGuia({
          name,
          email,
        });
      }
      return res
        .status(200)
        .json({ status: true, message: "Registro Exitoso", user: user });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: "Error al registrar usuario",
      });
    }
  };

  login = async (req, res) => {
    const { email } = req.body;
    try {
      let user = null;
      const usuario = await userModel.findOne({ email });
      const guide = await guideModel.findOne({ email });

      if (usuario) {
        user = usuario;
      } else if (guide) {
        user = guide;
      }

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Credenciales incorrectas",
        });
      }

      const token = this.generateToken(user);
      const { password, role, ...rest } = user._doc;

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso!",
        token,
        data: { ...rest, role },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al iniciar sesión",
      });
    }
  };

  RequestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await guideModel.findOne({ email });
      }
      if (!user) {
        return res.render("changePass", { error: "Usuario no encontrado" });
      }
      const token = generarResetToken();
      user.token_reset = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();
      await mailer.enviarCorreoRestablecimiento(email, token);
      res.redirect("/confirm");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  resetPassword = async (req, res) => {
    const { email, password, token } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await guideModel.findOne({ email });
      }
      if (!user) {
        return res.render("resetPass", { error: "Usuario no encontrado" });
      }
      const resetToken = user.token_reset;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetPass", { error: "Token invalido" });
      }
      const ahora = new Date();
      if (ahora > resetToken.expire) {
        return res.render("resetPass", { error: "El token expiro" });
      }
      if (isValidPassword(password, user)) {
        return res.render("resetPass", {
          error: "La nueva contraseña no puede ser igual a a la anterior",
        });
      }
      user.password = createHash(password);
      user.token_reset = undefined;
      await user.save();
      return res.redirect("/login");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };
}

module.exports = AuthController;
