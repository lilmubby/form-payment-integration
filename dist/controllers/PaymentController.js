import {} from "express";
import { MonnifyService } from "../services/MonnifyService.js";
import { MailService } from "../services/MailService.js";
import { config } from "../config/env.js";
import axios from "axios";
import catchAsync from "../util/catchAsync.js";
import logger from "../util/logger.js";
export class PaymentController {
    monnify = new MonnifyService();
    mail = new MailService();
    initializePayment = catchAsync(async (req, res) => {
        try {
            logger.info("Initializing payment with data:", { body: req.body });
            const checkoutUrl = await this.monnify.initializeTransaction(req.body);
            logger.info("Checkout URL generated:", { body: checkoutUrl });
            res.redirect(checkoutUrl);
        }
        catch (error) {
            res.status(500).json({ error, body: req.body });
        }
    });
    verifyPayment = catchAsync(async (req, res) => {
        const paymentReference = req.query.paymentReference;
        if (!paymentReference)
            return res.status(400).send("Missing payment reference");
        try {
            const tx = await this.monnify.verifyTransaction(paymentReference);
            const isPaid = tx.paymentStatus === "PAID";
            const userName = tx.customerName || "Unknown";
            const userEmail = tx.customer.email || "";
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
                await axios.post(`https://api.jotform.com/form/${config.JOTFORM_FORM_ID}/submissions?apiKey=${config.JOTFORM_API_KEY}`, {
                    submission: {
                        q1_name: userName,
                        q2_email: userEmail,
                        q3_amount: amount,
                    },
                });
            }
            // Redirect to user
            return res.redirect(isPaid ? config.REDIRECT_SUCCESS_URL : config.REDIRECT_FAILED_URL);
        }
        catch (err) {
            console.error("Payment verification error:", err.response?.data || err.message);
            res.status(500).send("Payment processing failed");
        }
    });
}
//# sourceMappingURL=PaymentController.js.map