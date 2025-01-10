const userModel = require("../models/user.model");
const guideModel = require("../models/guides.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configObject = require("../config/env.config");
const { createHash } = require("../utils/hash.util");

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
}

module.exports = AuthController;
