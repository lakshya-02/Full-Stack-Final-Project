import dotenv from "dotenv";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter((name) => !process.env[name]?.trim());

  if (missingVars.length) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
};

const startServer = async () => {
  try {
    validateEnvironment();
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
