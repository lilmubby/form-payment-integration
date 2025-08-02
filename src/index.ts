require("dotenv").config();

import  application from "./app.js"
import { config } from "./config/env.js";


async function startServer() {
  const PORT = config.PORT || 5000;

  application.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}