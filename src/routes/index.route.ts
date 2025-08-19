import { Router } from "express";
import paymentRoute from "./payment.route.js";

const route = Router();

route.use("/payment", paymentRoute)

export default route;