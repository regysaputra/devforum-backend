import {asClass, asFunction, asValue, createContainer} from "awilix";
import PinoLoggerService from "./services/PinoLoggerService.js";
import BcryptHashService from "./services/BcryptHashService.js";
import {Pool} from "pg";
import PostgresVerificationCodeRepository from "./repository/PostgresVerificationCodeRepository.js";
import PostgresUserRepository from "./repository/PostgresUserRepository.js";
import SendVerificationCode from "../applications/use_cases/SendVerificationCode.js";
import AuthController from "../adapters/http/controllers/AuthController.js";
import UuidGeneratorService from "./services/UuidGeneratorService.js";
import VerifyCode from "../applications/use_cases/VerifyCode.js";
import JwtTokenService from "./services/JwtTokenService.js";
import RegisterUser from "../applications/use_cases/RegisterUser.js";
import CryptoOpaqueTokenService from "./services/CryptoOpaqueTokenService.js";
import config from "../shared/config/index.js";
import BullMqNotificationService from "./services/BullMqNotificationService.js";
import PostgresRefreshTokenRepository from "./repository/PostgresRefreshTokenRepository.js";
import RefreshSession from "../applications/use_cases/RefreshSession.js";
import GeoIpLocationService from "./services/GeoIpLocationService.js";
import Login from "../applications/use_cases/Login.js";
import verifyAccessToken from "../adapters/http/middleware/verifyAccessToken.js";
import Logout from "../applications/use_cases/Logout.js";
import GetProfile from "../applications/use_cases/GetProfile.js";
import UserController from "../adapters/http/controllers/UserController.js";
import {Queue} from "bullmq";
import SendVerificationCodeWorker from "../applications/use_cases/SendVerificationCodeWorker.js";
import IORedis from "ioredis";
import TwilioSmsService from "./services/TwilioSmsService.js";
import NodemailerEmailService from "./services/NodemailerEmailService.js";
import GetAllThread from "../applications/use_cases/GetAllThread.js";
import ThreadController from "../adapters/http/controllers/ThreadController.js";
import PostgresThreadRepository from "./repository/PostgresThreadRepository.js";

const container = createContainer();

const dbPool = new Pool({
  connectionString: config.database.url,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000
});

// Register the dependencies
container.register({
  config: asValue(config),

  // Database Connection
  dbPool: asValue(dbPool),

  // Redis connection
  redisConnection: asFunction(({ config }) => {
    return new IORedis({
      host: config.redis.host,
      port: config.redis.port,
      maxRetriesPerRequest: null,
    });
  }).singleton(),

  notificationQueue: asFunction(({ redisConnection }) => {
    return new Queue("notification-queue", { connection: redisConnection });
  }).singleton(),

  // Services
  logger: asClass(PinoLoggerService).singleton(),
  hashService: asClass(BcryptHashService).singleton(),
  idGeneratorService: asClass(UuidGeneratorService).singleton(),
  tokenService: asClass(JwtTokenService).singleton(),
  opaqueTokenService: asClass(CryptoOpaqueTokenService).singleton(),
  notificationService: asClass(BullMqNotificationService).singleton(),
  locationService: asClass(GeoIpLocationService).singleton(),
  smsService: asClass(TwilioSmsService).singleton(),
  emailService: asClass(NodemailerEmailService).singleton(),

  // Repositories
  userRepository: asClass(PostgresUserRepository).singleton(),
  refreshTokenRepository: asClass(PostgresRefreshTokenRepository).singleton(),
  verificationCodeRepository: asClass(PostgresVerificationCodeRepository).singleton(),
  threadRepository: asClass(PostgresThreadRepository).singleton(),

  // Use Cases
  sendVerificationCodeUseCase: asClass(SendVerificationCode).scoped(),
  sendVerificationCodeWorkerUseCase: asClass(SendVerificationCodeWorker).scoped(),
  sendSecurityAlertWorkerUseCase: asClass(SendVerificationCodeWorker).scoped(),
  verifyCodeUseCase: asClass(VerifyCode).scoped(),
  registerUserUseCase: asClass(RegisterUser).scoped(),
  loginUseCase: asClass(Login).scoped(),
  refreshSessionUseCase: asClass(RefreshSession).scoped(),
  logoutUseCase: asClass(Logout).scoped(),
  getProfileUseCase: asClass(GetProfile).scoped(),
  getAllThreadUseCase: asClass(GetAllThread).scoped(),

  // Middlewares
  verifyAccessToken: asFunction(verifyAccessToken).singleton(),

  // Controllers
  authController: asClass(AuthController).scoped(),
  userController: asClass(UserController).scoped(),
  threadController: asClass(ThreadController).scoped()
});

export default container;