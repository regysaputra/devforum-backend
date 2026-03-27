import express from "express";
import { makeInvoker } from "awilix-express";

function createThreadRoutes({ verifyAccessToken }) {
  const router = express.Router();
  const api = makeInvoker(({ threadController }) =>  threadController);

  router.get(
    '/',
    api('getAllThread')
  );

  return router;
}

export default createThreadRoutes;