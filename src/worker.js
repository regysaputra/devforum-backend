import "dotenv/config";
import { Worker } from "bullmq";
import container from "./infrastructures/container.js";

const logger = container.resolve("logger");
const connection = container.resolve("redisConnection");

logger.info("Worker started");

// Create the Consumer listening to the specific queue
const worker = new Worker("notification-queue", async (job) => {
  switch(job.name) {
    case "send-verification-code":
      const sendVerificationCodeWorker = container.resolve("sendVerificationCodeWorkerUseCase");
      await sendVerificationCodeWorker.execute({
        identifier: job.data.identifier,
        code: job.data.code,
        jobId: job.id,
      });

      break;
    case "send-security-alert":
      const sendSecurityAlert = container.resolve("sendSecurityAlertWorkerUseCase");
      await sendSecurityAlert.execute({
        email: job.data.email,
        browser: job.data.browser,
        os: job.data.os,
        device: job.data.device,
        jobId: job.id
      });

      break;
    default:
      logger.error("Unknown job name", { jobId: job.id, name: job.name });
  }
}, { connection });

worker.on("completed", (job, result) => {
  logger.info("Job completed", {
    job: job.id,
    name: job.name,
    result: result,
  });
});

worker.on("failed", (job, error) => {
  logger.error("Job failed", {
    job: job.id,
    name: job.name,
    error: error.message,
    attemptsMade: job.attemptsMade,
  });
});