const nodemailer = require("nodemailer");
const configObject = require("../config/env.config");
const { logger } = require("../middlewares/logger.middleware");

class MailerManager {}

module.exports = MailerManager;