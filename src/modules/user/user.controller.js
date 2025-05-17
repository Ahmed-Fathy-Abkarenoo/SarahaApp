import { Router } from "express";
import * as userServices from "./services/user.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endPoint } from "./user.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js";

const userRouter = Router();

userRouter.get(
  "/profile",
  authentication(),
  authorization(endPoint.profile),
  userServices.userProfile
);
userRouter.patch(
  "/profile",
  validation(validators.updateProfileValidator),
  authentication(),
  authorization(endPoint.profile),
  userServices.updateProfile
);

userRouter.patch(
  "/profile/password",
  validation(validators.updatePasswordValidator),
  authentication(),
  authorization(endPoint.profile),
  userServices.updatePassword
);

userRouter.patch(
  "/profile/email",
  validation(validators.reActivateValidator),
  authentication(),
  authorization(endPoint.profile),
  userServices.updateEmail
);

userRouter.delete(
  "/profile",
  authentication(),
  authorization(endPoint.profile),
  userServices.freezeAccount
);

userRouter.get(
  "/:userId/share-profile",
  validation(validators.shareProfileValidator),
  userServices.shareProfile
);

userRouter.post(
  "/reactivate",
  validation(validators.reActivateValidator),
  userServices.reActivateAccount
);

userRouter.patch("/reconfirm-email", userServices.reConfirmEmail);

userRouter.patch(
  "/forget-password",
  validation(validators.changeForgetenPasswordValidator),
  userServices.changeForgetenPassword
);

export default userRouter;
