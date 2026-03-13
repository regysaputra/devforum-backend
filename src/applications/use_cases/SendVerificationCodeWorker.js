class SendVerificationCodeWorker {
  constructor({ emailService, smsService, logger }) {
    this.emailService = emailService;
    this.smsService = smsService;
    this.logger = logger;
  }

  async execute({ identifier, code, jobId }) {
    this.logger.info("Processing verification code logic", { jobId, identifier });

    try {
      if (identifier.includes("@")) {
        await this.emailService.send(identifier, {
          type: "VERIFICATION_CODE",
          context: { code },
        });
      } else {
        await this.smsService.send(identifier, {
          type: "VERIFICATION_CODE",
          context: { code },
        });
      }
    } catch (error) {
      this.logger.error("Worker failed to send verification code", { error, jobId, identifier });

      throw new Error(error.message);
    }
  }
}

export default SendVerificationCodeWorker;