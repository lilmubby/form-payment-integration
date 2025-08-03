import dotenv from 'dotenv';
import  application from "./app.js"
import { config } from "./config/env.js";

dotenv.config();

async function startServer() {
  const PORT = config.PORT || 5000;

  application.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

  startServer();