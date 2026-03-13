import {asValue} from "awilix";
import container from "../../../infrastructures/container.js";

const awilixMiddleware = (req, res, next) => {
  req.container = container.createScope();

  req.container.register({
    requestId: asValue(Math.random().toString(36).substring(7))
  });

  next();
}

export default awilixMiddleware;