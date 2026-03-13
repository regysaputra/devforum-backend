import express from "express";
import {makeInvoker} from "awilix-express";

function createUserRoutes({ verifyAccessToken }) {
  const router = express.Router();
  const api = makeInvoker(({ userController }) =>  userController);

  router.get(
    '/me',
    verifyAccessToken,
    api('getProfile')
  );

  // router.post(
  //   "/register/verify-code",
  //   validateInput(VerifyCodeDTO),
  //   api('verifyCode')
  // );

  return router;
}

export default createUserRoutes;