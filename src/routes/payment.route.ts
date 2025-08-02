import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";

const router = Router();
const controller = new PaymentController();

router.get("/payment-status", controller.handlePaymentStatus.bind(controller));

export default router;