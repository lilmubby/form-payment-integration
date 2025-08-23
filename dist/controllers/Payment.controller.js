import {} from "express";
import { MonnifyService } from "../services/Monnify.service.js";
import { MailService } from "../services/Mail.service.js";
import { config } from "../config/env.js";
import catchAsync from "../util/catchAsync.js";
import logger from "../util/logger.js";
import JotFormService from "../services/JotForm.service.js";
export class PaymentController {
    monnify = new MonnifyService();
    mail = new MailService();
    jotform = new JotFormService();
    initializePayment = catchAsync(async (req, res) => {
        try {
            logger.info("Initializing payment with data:", { body: req.body });
            await this.jotform.deleteSubmission(req.body.submission_id); // Delete existing submission
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
            // Send emails
            await this.mail.sendEmail(tx);
            const meta = tx.metaData;
            const firstName = meta?.firstName || "Unknown";
            const lastName = meta?.lastName || "Unknown";
            const submission_id = meta?.submission_id || "";
            const amount = tx.amountPaid || 0;
            const deliverytype = meta?.deliveryType || "";
            const email = meta?.email || "";
            // Submit to JotForm only on success
            if (isPaid) {
                await this.jotform.submitForm(meta);
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
//# sourceMappingURL=Payment.controller.js.map