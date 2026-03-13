import "dotenv/config";
import container from "./infrastructures/container.js";
import express from 'express';
import errorHandler from "./adapters/http/middleware/errorHandler.js";
import httpLogger from "./adapters/http/middleware/httpLogger.js";
import config from "./shared/config/index.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {scopePerRequest} from "awilix-express";
import createRouter from "./adapters/http/routes/index.js";

// Initialize Express
const app = express();

// Trust the first reverse proxy (e.g., Nginx) so req.ip returns the real client IP
app.set('trust proxy', true);

app.use(express.json());                          // Handles: Content-Type: application/json
app.use(express.urlencoded({ extended: true }));  // Handles: Content-Type: application/x-www-form-urlencoded
app.use(helmet()); // Helps secure Express apps by setting various HTTP headers
app.use(cors()); // Allows cross-origin requests
app.use(cookieParser()); // Parses cookies sent by the client
app.use(scopePerRequest(container)); // Dependency Injection Scope Middleware

const logger = container.resolve('logger');
const verifyAccessTokenMiddleware = container.resolve('verifyAccessToken');

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(), // Tells you how many seconds the server has been alive
    timestamp: new Date().toISOString()
  });
});

app.use(httpLogger(logger));

// Global Error Handling
// This MUST be the very last middleware you use.
// It catches anything that falls through the cracks or throws unexpectedly.

app.use("/api", createRouter({
  verifyAccessToken: verifyAccessTokenMiddleware,
}));

app.use(errorHandler);

// Start the Server
app.listen(config.app.port, () => {
  logger.info(`Web server running on port ${config.app.port} in ${config.app.env} mode`);
});

export default app;