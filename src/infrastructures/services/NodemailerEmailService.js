import nodemailer from "nodemailer";
import Result from "../../shared/core/Result.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import config from "../../shared/config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NodemailerEmailService {
  #transporter;
  #templates;
  #fromEmail;

  constructor() {
    // Grab SMTP configuration from environment variables
    const smtpHost = config.smtp.host;
    const smtpPort = config.smtp.port;
    const smtpUser = config.smtp.user;
    const smtpPass = config.smtp.pass;
    this.#fromEmail = config.smtp.from; // Keep this consistent!

    // Fail Fast: Ensure SMTP is configured before the server boots up
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !this.#fromEmail) {
      throw new Error('Missing SMTP environment variables.');
    }

    this.#templates = {};

    try {
      this.#templates.VERIFICATION_CODE = fs.readFileSync(
        path.join(__dirname, "../../shared/templates/verification_code.html"), "utf-8"
      );
      this.#templates.SECURITY_ALERT = fs.readFileSync(
        path.join(__dirname, "../../shared/templates/login_alert.html"), "utf-8"
      );
      this.#templates.PASSWORD_RESET = undefined;
    } catch (error) {
      throw new Error(`SmtpEmailService: Could not load HTML template ${error.message}`);
    }

    this.#transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      }
    });
  }

  async send(identifier, payload) {
    let subject = '';
    let textBody = '';
    let htmlBody = '';

    // 🧠 TEMPLATE ROUTER
    // Decides what the email looks like based on the 'type'
    switch (payload.type) {
      case 'VERIFICATION_CODE':
        subject = 'Your Verification Code';
        textBody = `Your code is: ${payload.context.code}`;
        htmlBody = this.#templates.VERIFICATION_CODE.replace('{{VERIFICATION_CODE}}', payload.context.code);
        break;

      case 'SECURITY_ALERT':
        subject = 'Unusual Login Detected';
        textBody = `We've detected a new sign-in to your account from ${payload.context.os} ${payload.context.browser}. If it's not you follow this link: https://devforum.space/user/change-password`;
        htmlBody = this.#templates.VERIFICATION_CODE
          .replaceAll('{{OS}}', payload.context.os)
          .replaceAll('{{BROWSER}}', payload.context.browser)
          .replaceAll("{{DEVICE}}", payload.context.device);
        break;

      case 'PASSWORD_RESET':
        subject = 'Reset Your Password';
        textBody = `Reset your password here: ${payload.context.link}`;
        htmlBody = this.#templates.PASSWORD_RESET.replace('{{RESET_LINK}}', payload.context.link);
        break;

      default:
        // Fail fast if a developer tries to send an unknown email type
        throw new Error(`Unknown notification type: ${payload.type}`);
    }

    try {
      // Call the external SMTP server
      const info = await this.#transporter.sendMail({
        from: `"${config.app.name}" <${this.#fromEmail}>`,
        to: identifier,
        subject: subject,
        text: textBody,
        html: htmlBody
      });

      return Result.ok(info.response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

export default NodemailerEmailService;