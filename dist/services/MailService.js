import nodemailer from "nodemailer";
import { config } from "../config/env.js";
export class MailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    });
    async sendEmail(to, subject, body) {
        await this.transporter.sendMail({
            from: `"Payment System" <${config.EMAIL_USER}>`,
            to,
            subject,
            text: body,
        });
    }
}
//# sourceMappingURL=MailService.js.map