import { UAParser } from "ua-parser-js";

class AuthController {
  #sendVerificationCodeUseCase;
  #verifyCodeUseCase;
  #registerUserUseCase;
  #loginUseCase;
  #refreshSessionUseCase;
  #logoutUseCase;
  #logger;
  
  constructor({ sendVerificationCodeUseCase, verifyCodeUseCase, registerUserUseCase, loginUseCase, refreshSessionUseCase, logoutUseCase, logger }) {
    this.#sendVerificationCodeUseCase = sendVerificationCodeUseCase;
    this.#verifyCodeUseCase = verifyCodeUseCase;
    this.#registerUserUseCase = registerUserUseCase;
    this.#loginUseCase = loginUseCase;
    this.#refreshSessionUseCase = refreshSessionUseCase;
    this.#logoutUseCase = logoutUseCase;
    this.#logger = logger;

    this.requestCode = this.requestCode.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshSession = this.refreshSession.bind(this);
    this.logout = this.logout.bind(this);
  }

  async requestCode(req, res, next)  {
    try {
      const result = await this.#sendVerificationCodeUseCase.execute(req.body);

      if (result.isFailure) {
        const error = result.error;

        if (error.code === "RATE_LIMITED") {
          return res.status(429).json({
            status: "fail",
            data: { message: error }
          });
        }

        return res.status(400).json({
          status: "fail",
          data: {
            message: error
          }
        });
      }

      return res.status(200).json({
        status: "success",
        data: { message: "verification code sent successfully" }
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyCode(req, res, next) {
    try {
      const result = await this.#verifyCodeUseCase.execute(req.body);

      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: { message: result.error }
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          registration_token: result.getValue()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const result = await this.#registerUserUseCase.execute({
        ip: req.ip,
        userAgent: this._getUserAgent(req),
        identifier: req.identifier,
        ...req.body
      });

      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: {
            message: result.error
          }
        });
      }

      this._setRefreshTokenToCookie(res, result.getValue().refreshToken, result.getValue().expiresAt);

      return res.status(200).json({
        status: "success",
        data: {
          user: result.getValue().user,
          access_token: result.getValue().accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.#loginUseCase.execute({
        ip: req.ip,
        userAgent: this._getUserAgent(req),
        ...req.body
      });

      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: {
            message: result.error
          }
        });
      }

      this._setRefreshTokenToCookie(res, result.getValue().refreshToken, result.getValue().expiresAt);

      return res.status(200).json({
        status: "success",
        data: {
          user: result.getValue().user,
          access_token: result.getValue().accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshSession(req, res, next) {
    try {
      const result = await this.#refreshSessionUseCase.execute({
        ip: req.ip,
        userAgent: this._getUserAgent(req),
        refreshToken: req.cookies.refresh_token,
      });

      if (result.isFailure) {
        // 🚨 If the kill switch triggered or token is invalid, clear their cookie!
        res.clearCookie('refreshToken');

        if (result.error.code === 'SECURITY_COMPROMISED') {
          return res.status(403).json({ status: 'fail', data: { message: result.error.message } });
        }
        return res.status(401).json({ status: 'fail', data: { message: result.error } });
      }

      this._setRefreshTokenToCookie(res, result.getValue().refreshToken, result.getValue().expiresAt);

      return res.status(200).json({
        status: "success",
        data: {
          accessToken: result.getValue().accessToken,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await this.#logoutUseCase.execute({
        refreshToken: req.cookies.refresh_token,
      });

      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: { message: result.error }
        });
      }

      res.clearCookie('refresh_token');

      return res.status(200).json({
        status: "success",
        data: { message: "Logged out successfully" }
      });
    } catch (error) {
      next(error);
    }
  }

  _setRefreshTokenToCookie(res, token, expiresAt) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: expiresAt,
    });
  }

  _getUserAgent(req) {
    const rawUserAgent = req.headers["user-agent"];
    let userAgent;

    if (rawUserAgent) {
      const parser = new UAParser(rawUserAgent);
      const ua = parser.getResult();

      const browser = ua.browser.name ? `${ua.browser.name}` : 'Unknown Browser';
      const os = ua.os.name ? ` ${ua.os.name} ${ua.os.version || ''}`.trim() : '';

      // If it's a mobile device, append the brand and model!
      const device = ua.device.vendor && ua.device.model
        ? ` (${ua.device.vendor} ${ua.device.model})`
        : '';

      userAgent = {
        browser: browser,
        os: os,
        device: device
      };
    }

    return userAgent;
  }
}

export default AuthController;