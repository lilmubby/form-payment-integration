import { type Request, type Response } from "express";
import { MonnifyService } from "../services/MonnifyService.js";
import { MailService } from "../services/MailService.js";
import { config } from "../config/env.js";
import axios from "axios";

export class PaymentController {
  private monnify = new MonnifyService();
  private mail = new MailService();

  async handlePaymentStatus(req: Request, res: Response) {
    const paymentReference = req.query.paymentReference as string;
    if (!paymentReference) return res.status(400).send("Missing payment reference");

    try {
      const token = await this.monnify.getAccessToken();
      const tx = await this.monnify.verifyTransaction(paymentReference, token);

      const isPaid = tx.paymentStatus === "PAID";
      const userName = tx.customerName || "Unknown";
      const userEmail = tx.customerEmail || "unknown@example.com";
      const paymentMethod = tx.paymentMethod || "N/A";
      const amount = tx.amount || 0;

      const subjectStatus = isPaid ? "SUCCESS" : "FAILED";
      const subject = `[Payment ${subjectStatus}] ${userName} — ${paymentMethod}`;
      const body = `
Hello,

A payment attempt has been made by:

Name: ${userName}
Email: ${userEmail}
Amount: ₦${amount}
Payment Method: ${paymentMethod}
Status: ${subjectStatus}

Thank you,
JotForm-Monnify Payment System
`;

      // Send emails
      await this.mail.sendEmail(userEmail, subject, body);
      await this.mail.sendEmail(config.ADMIN_EMAIL, subject, body);

      // Submit to JotForm only on success
      if (isPaid) {
        await axios.post(
          `https://api.jotform.com/form/${config.JOTFORM_FORM_ID}/submissions?apiKey=${config.JOTFORM_API_KEY}`,
          {
            submission: {
              q1_name: userName,
              q2_email: userEmail,
              q3_amount: amount,
            },
          }
        );
      }

      // Redirect to user
      return res.redirect(isPaid ? config.REDIRECT_SUCCESS_URL : config.REDIRECT_FAILED_URL);
    } catch (err: any) {
      console.error("Payment verification error:", err.response?.data || err.message);
      res.status(500).send("Payment processing failed");
    }
  }
}
