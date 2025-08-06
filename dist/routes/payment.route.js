import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";
const router = Router();
const paymentController = new PaymentController();
router.post("/initialize", paymentController.initializePayment);
router.get("/verify", paymentController.verifyPayment);
export default router;
//# sourceMappingURL=payment.route.js.map