const userModel = require("../models/user.model");

class UserController {
  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({});
      if (users.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No hay usuarios por el momento" });
      }
      res.status(200).json({
        status: true,
        message: "Usuarios encontrados con éxito",
        usuarios: users,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los usuarios",
        error: err.message,
      });
    }
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (user.length === 0) {
        res.status(404).json({
          status: false,
          message: `usuario no encontrado`,
        });
      }
      res.status(200).json({
        status: true,
        message: `Usuario encontrado con exito`,
        usuario: user,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Error al obtener el usuario`,
        error: err.message,
      });
    }
  };

  updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      let photoUrl = req.body.photo;
      if (req.file) {
        photoUrl = req.file.path;
      }
      const updateUser = await userModel.findByIdAndUpdate(
        id,
        { $set: { ...req.body, photo: photoUrl } },
        { new: true }
      );
      if (updateUser.length === 0) {
        res.status(404).json({
          status: false,
          message: `usuario no encontrado`,
        });
      }
      res.status(200).json({
        status: true,
        message: "Usuario actualizado con exito",
        usuario: updateUser,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Error al actualizar el usuario`,
        error: err.message,
      });
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findByIdAndDelete(id);
      if (user.length === 0) {
        res.status(404).json({
          status: false,
          message: `usuario no encontrado`,
        });
      }
      res.status(200).json({
        status: true,
        message: `Usuario eliminado con exito`,
        usuario: user,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Error al eliminar el usuario`,
        error: err.message,
      });
    }
  };

  getUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
      const user = await userModel.findById(userId).select("-password"); 
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      res.status(200).json({
        success: true,
        message: "Información del perfil obtenida exitosamente",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la información del perfil",
      });
    }
  };

  changeRolAdmin = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const newRol = user.role === "usuario" ? "admin" : "usuario";
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { role: newRol },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error cambiando el rol:", error);
      res.status(500).send("Error interno del servidor");
    }
  };
}

module.exports = UserController;
