import { type Request, type Response } from "express";
import { MonnifyService } from "../services/MonnifyService.js";
import { MailService } from "../services/MailService.js";
import { config } from "../config/env.js";
import axios from "axios";
import catchAsync from "../util/catchAsync.js";
import logger from "../util/logger.js";

export class PaymentController {
  private monnify = new MonnifyService();
  private mail = new MailService();

  initializePayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      try {
        logger.info("Initializing payment with data:", { body: req.body });
        const checkoutUrl = await this.monnify.initializeTransaction(req.body);
        logger.info("Checkout URL generated:", { body: checkoutUrl });
        res.redirect(checkoutUrl);
      } catch (error) {
        res.status(500).json({ error, body: req.body });
      }
    }
  );

  verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const paymentReference = req.query.paymentReference as string;
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
        await axios.post(
          `https://api.jotform.com/form/${config.JOTFORM_FORM_ID}/submissions?apiKey=${config.JOTFORM_API_KEY}`,
          {
            submission: {
              ...meta
            },
          }
        );
      }

      // Redirect to user
      return res.redirect(
        isPaid ? config.REDIRECT_SUCCESS_URL : config.REDIRECT_FAILED_URL
      );
    } catch (err: any) {
      console.error(
        "Payment verification error:",
        err.response?.data || err.message
      );
      res.status(500).send("Payment processing failed");
    }
  });
}
