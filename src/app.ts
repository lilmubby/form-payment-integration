import express from "express";
import routes from "./routes/index.route.js";
import cors from "cors";
import { MailService } from "./services/MailService.js";
import morgan from "morgan";
import  logger  from "./util/logger.js";

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
    write: (message: string) => logger.info("Morgan" +message.trim()),
  },
}));


app.use("/api/v1", routes);

const mail = new MailService();

app.get("/email", async (req, res) => {
  await mail.sendEmail("ymubarak247@gmail.com", "[Test] --Subject", "This is just a test")
  res.send("Sent")
})

app.get("/", (req, res) => {
  logger.info("Root endpoint hit");
  res.json("Monnify JotForm Backend Running")
  // res.redirect("https://google.com")
})

export default app;