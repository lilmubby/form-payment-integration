import nodemailer from "nodemailer";
import { config } from "../config/env.js";

export class MailService {
  private transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"Payment System" <${config.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
