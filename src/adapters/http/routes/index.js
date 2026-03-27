import express from 'express';
import createAuthRoutes from "./authRoutes.js";
import createUserRoutes from "./userRoutes.js";
import createThreadRoutes from "./threadRoutes.js";

function createRouter({ verifyAccessToken }) {
  const router = express.Router();
  const authRoutes = createAuthRoutes({ verifyAccessToken });
  const userRoutes = createUserRoutes({ verifyAccessToken });
  const threadRoutes = createThreadRoutes({ verifyAccessToken });

  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);
  router.use("/threads", threadRoutes);

  return router;
}

export default createRouter;