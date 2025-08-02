import express from "express";
import paymentRoutes from "./routes/payment.route.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));
app.use("/api/vi", paymentRoutes);
export default app;
//# sourceMappingURL=app.js.map