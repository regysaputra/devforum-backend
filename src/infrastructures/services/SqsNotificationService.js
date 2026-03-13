import NotificationService from "../../applications/interfaces/NotificationService.js";
import {SendMessageCommand} from "@aws-sdk/client-sqs";

class SqsNotificationService extends NotificationService {
  #logger;
  #sqsClient;
  #queueUrl;

  constructor({ logger, sqsClient, config }) {
    super();
    this.#logger = logger;
    this.#sqsClient = sqsClient;
    this.#queueUrl = config.aws.sqsNotificationQueueUrl;
  }

  async sendNotificationService(identifier, code) {
    try {
      // SQS requires the payload to be a stringified JSON object
      const payload = JSON.stringify({
        type: 'send-verification-code', // Added to help the Lambda worker route the job
        identifier,
        code
      });

      const command = new SendMessageCommand({
        QueueUrl: this.#queueUrl,
        MessageBody: payload,
      });

      await this.#sqsClient.send(command);

      return true;
    } catch (error) {
      this.#logger.error('Failed to send notification', {
        identifier,
        error: error.message
      });

      throw new Error("Notification system is currently unavailable");
    }
  }

  async sendSecurityAlert(email, browser, os, device) {
    try {
      const payload = JSON.stringify({
        type: 'send-security-alert',
        email,
        browser,
        os,
        device
      });

      const command = new SendMessageCommand({
        QueueUrl: this.#queueUrl,
        MessageBody: payload,
      });

      await this.#sqsClient.send(command);
    } catch (error) {
      this.#logger.error('Failed to add security alert job to SQS', {
        email,
        error: error.message
      });
      throw new Error("Notification system is currently unavailable");
    }
  }
}

export default SqsNotificationService;