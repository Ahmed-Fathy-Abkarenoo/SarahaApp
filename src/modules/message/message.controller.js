import { Router } from "express";
import * as messageService from "./services/message.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./message.validation.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endPoint } from "../user/user.endpoint.js";

const msgRouter = Router();

msgRouter.post(
  "/send-message",
  validation(validators.sendMsgValidator),
  messageService.sendMsg
);

msgRouter.delete(
  "/delete-message/:msgId",
  authentication(),
  authorization(endPoint.profile),
  messageService.deleteMsg
);

export default msgRouter;
