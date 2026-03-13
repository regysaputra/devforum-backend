import express from 'express';
import createAuthRoutes from "./authRoutes.js";
import createUserRoutes from "./userRoutes.js";

function createRouter({ verifyAccessToken }) {
  const router = express.Router();
  const authRoutes = createAuthRoutes({ verifyAccessToken });
  const userRoutes = createUserRoutes({ verifyAccessToken });

  router.use("/auth", authRoutes);
  router.use("/user", userRoutes);

  return router;
}

export default createRouter;