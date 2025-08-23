import { Router } from "express";
import { PaymentController } from "../controllers/Payment.controller.js";

const router = Router();
const paymentController = new PaymentController();

router.post("/initialize", paymentController.initializePayment);
router.get("/verify", paymentController.verifyPayment);

export default router;