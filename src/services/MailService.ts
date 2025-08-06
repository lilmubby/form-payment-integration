import nodemailer from "nodemailer";
import { config } from "../config/env.js";

export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  async sendEmail(to: string, subject: string, body: string) {
    await this.transporter.sendMail({
      from: `"Payment System" <${config.EMAIL_USER}>`,
      to,
      subject,
      text: body,
    });
  }
}
