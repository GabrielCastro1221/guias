const nodemailer = require("nodemailer");
const configObject = require("../config/env.config");
const { logger } = require("../middlewares/logger.middleware");

class MailerManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: configObject.mailer.email_service,
      auth: {
        user: configObject.mailer.mailer_user,
        pass: configObject.mailer.mailer_pass,
      },
    });
  }

  async enviarCorreoRestablecimiento(email, token) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Cloud Forest Colombia - Recuperar contraseña",
        html: ` <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
        <div style="text-align: center; margin-bottom: 20px;"> 
          <h1 style="color: #1b715e;">Cloud Forest Colombia</h1>
        </div> 
        <h2 style="color: #1b715e;">Olvidaste tu contraseña?</h2> 
        <p>Has olvidado tu contraseña? no te preocupes con el siguiente codigo de confirmacion podras actualizar tu contraseña</p> <p>codigo de confirmacion: <strong style="color: #1b715e;">${token}</strong></p> 
        <h3 style="color: #1b715e;">¡Este token expira en una hora!</h3> 
        <div style="text-align: center; margin-top: 20px;"> 
          <a href="${configObject.server.base_url}/change-password" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Recuperar contraseña</a> 
        </div> 
      </div> `,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar Email de restablecimiento de contraseña:",
        error.message
      );
    }
  }

  async enviarCorreoBienvenidaGuia(email) {
    try {
      const Opt = {
        from: configObject.mailer.email_from,
        to: email,
        subject: "Bienvenido a Cloud Forest Colombia",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
          <div style="text-align: center; margin-bottom: 20px;"> 
            <h1 style="color: #1b715e;">Cloud Forest Colombia</h1>
          </div> 
          <h2 style="color: #1b715e;">¡Bienvenido a Cloud Forest Colombia!</h2> 
          <p>Te has registrado como un guia turistico en nuestra plataforma. Para poder ser aprobado, por favor completa todos los datos de tu perfil y ponte en contacto con el administrador de la plataforma</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${configObject.mailer.mailer_user}" target="_blank" style="display: inline-block; background-color: #1b715e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">Contactar</a>
          </div>
          <p>Una vez aprobado tu perfil, podrás Trabajar en nuestra plataforma</p>
        </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de bienvenida al guia turistico:",
        error.message
      );
    }
  }  

  async enviarCorreoNuevoGuia(guideData) {
    try {
      const { name, email } = guideData;
      const Opt = {
        from: configObject.mailer.email_from,
        to: configObject.mailer.mailer_user,
        subject: "Nuevo Registro de guia turistico en Cloud Forest Colombia",
        html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;"> 
              <div style="text-align: center; margin-bottom: 20px;"> 
                <h1 style="color: #1b715e;">Cloud Forest Colombia</h1>
              </div> 
              <h2 style="color: #1b715e;">Nuevo Registro de guia turistico</h2> 
              <p>Se ha registrado un nuevo guia turistico en la plataforma con los siguientes datos:</p>
              <ul>
                <li><strong>Nombre:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
              </ul>
              <p>Por favor, revise la información y tome las acciones necesarias para aprobar el perfil del guia turistico.</p>
            </div>`,
      };
      await this.transporter.sendMail(Opt);
    } catch (error) {
      logger.error(
        "Error al enviar correo de notificación de nuevo guia turistico:",
        error.message
      );
    }
  }
}

module.exports = MailerManager;
