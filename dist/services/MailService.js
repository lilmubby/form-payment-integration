import nodemailer from "nodemailer";
import { config } from "../config/env.js";
export class MailService {
    transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: false,
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });
    async sendEmail(to, subject, text) {
        await this.transporter.sendMail({
            from: `"Payment System" <${config.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
    }
}
//# sourceMappingURL=MailService.js.map