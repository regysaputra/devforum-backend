import twilio from "twilio";
import Result from "../../shared/core/Result.js";
import config from "../../shared/config/index.js";

class TwilioSmsService {
  #client;
  #fromNumber;
  
  constructor() {
    this.#fromNumber = config.twilio.fromNumber;
    const sid = config.twilio.accountSid;
    const token = config.twilio.authToken;

    if (!sid || !token || !this.#fromNumber) {
      throw new Error("missing twilio credentials in environment variables");
    }

    this.#client = twilio(sid, token);
  }

  async send(identifier, payload) {
    try {
      const response = await this.#client.messages.create({
        body: payload.context.code,
        from: this.#fromNumber,
        to: identifier
      });

      // Return a successful Result to the Use Case
      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

export default TwilioSmsService;