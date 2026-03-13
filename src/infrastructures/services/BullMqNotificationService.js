import NotificationService from "../../applications/interfaces/NotificationService.js";
import IORedis from "ioredis";
import {Queue} from "bullmq";
import config from "../../shared/config/index.js";

class BullMqNotificationService extends NotificationService {
  #logger;
  #notificationQueue;

  constructor({ logger, notificationQueue }) {
    super();
    this.#logger = logger;
    this.#notificationQueue = notificationQueue;
  }

  async sendVerificationCode(identifier, code) {
    try {
      // Add a job to the queue
      await this.#notificationQueue.add(
        'send-verification-code',
        { identifier, code },
        {
          attempts: 3, // Retry up to 3 times
          backoff: {
            type: 'exponential',  // Wait 1s, then 2s, then 4s between retries
            delay: 1000
          },
          removeOnComplete: true, // Automatically remove job from queue after it completes
          removeOnFail: {
            age: 10 * 60 // remove jobs older than 10 minutes
          }
        }
      );

      return true;
    } catch (error) {
      this.#logger.error('Failed to add job to notification queue', {
        identifier,
        error: error.message
      });

      throw new Error("Notification system is currently unavailable");
    }
  }

  async sendSecurityAlert(email, browser, os, device) {
    try {
      this.#notificationQueue.add(
        'send-security-alert',
        { email, browser, os, device },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: true,
          removeOnFail: {
            age: 100 * 60
          }
        }
      );
    } catch (error) {
      this.#logger.error('Failed to send security alert', {
        email,
        error: error.message
      });

      throw new Error("Notification system is currently unavailable");
    }
  }
}

export default BullMqNotificationService;