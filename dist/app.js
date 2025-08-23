import express from "express";
import routes from "./routes/index.route.js";
import cors from "cors";
import { MailService } from "./services/Mail.service.js";
import morgan from "morgan";
import logger from "./util/logger.js";
import { config } from "./config/env.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to enable CORS
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));
console.log("🚀 Starting server...");
app.use(morgan("combined", {
    stream: {
        write: (message) => logger.info("[Morgan]" + message.trim()),
    },
}));
app.use("/api/v1", routes);
const mail = new MailService();
app.get("/email", async (req, res) => {
    await mail.sendEmail({
        paymentStatus: "PAID",
        amount: 15000,
        customer: { email: config.TEST_USER_EMAIL, name: "Test User" },
        paymentMethod: "Card",
    });
    res.send("Sent");
});
app.get("/", (req, res) => {
    logger.info("Root endpoint hit");
    res.json("Monnify JotForm Backend Running");
});
export default app;
//# sourceMappingURL=app.js.map