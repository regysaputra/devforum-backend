import express from 'express';
import validateInput from "../middleware/validateInput.js";
import SendVerificationCodeDTO from "../dtos/SendVerificationCodeDTO.js";
import VerifyCodeDTO from "../dtos/VerifyCodeDTO.js";
import RegisterUserDTO from "../dtos/RegisterUserDTO.js";
import verifyRegistrationToken from "../middleware/verifyRegistrationToken.js";
import LoginDTO from "../dtos/LoginDTO.js";
import {makeInvoker} from "awilix-express";

function createAuthRoutes({ verifyAccessToken }) {
  const router = express.Router();
  const api = makeInvoker(({ authController }) =>  authController);

  router.post(
    '/register/request-code',
    validateInput(SendVerificationCodeDTO),
    api('requestCode')
  );

  router.post(
    "/register/verify-code",
    validateInput(VerifyCodeDTO),
    api('verifyCode')
  );

  router.post(
    "/register",
    verifyRegistrationToken,
    validateInput(RegisterUserDTO),
    api('register')
  );

  router.post(
    "/login",
    validateInput(LoginDTO),
    api('login')
  );

  router.post(
    "/refresh",
    api('refreshSession')
  );

  router.post(
    '/logout',
    verifyAccessToken,
    api('logout')
  );

  return router;
}

export default createAuthRoutes;