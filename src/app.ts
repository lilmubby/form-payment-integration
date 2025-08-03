import express from "express";
import paymentRoutes from "./routes/payment.route.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to enable CORS
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));
app.use("/api/v1", paymentRoutes);
app.get("api/v2/", (req, res) => {
  res.json("working")
})
app.post("api/v2/health-check", (req, res) => {
  res.json({
    data: req.body
  })
})

export default app;