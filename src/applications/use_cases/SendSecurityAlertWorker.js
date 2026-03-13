class SendSecurityAlertWorker{
  constructor({emailService, smsService, logger}) {
    this.emailService = emailService;
    this.smsService = smsService;
    this.logger = logger;
  }

  async execute({ email, browser, os, device, jobId }) {
    try {
      await this.emailService.send(email, {
        type: "SECURITY_ALERT",
        context: { browser, os, device },
      });
    } catch (error) {
      this.logger.error("Worker failed to send security alert", { error, jobId, email });

      throw new Error(error.message);
    }
  }
}

export default SendSecurityAlertWorker;