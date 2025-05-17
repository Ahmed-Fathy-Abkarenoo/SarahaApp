import MsgModel from "../../../DB/models/Msg.model.js";
import userModel from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import { successHandler } from "../../../utils/response/success.response.js";

export const sendMsg = asyncHandler(async (req, res, next) => {
  const { message, recipientId } = req.body;

  const user = await userModel.findOne({ _id: recipientId, isDeleted: false });
  if (!user) {
    return next(new Error("In-Valid recipient", { cause: 404 }));
  }

  const msg = await MsgModel.create({ message, recipientId });
  return successHandler({
    res,
    status: 201,
    msg: "messgae sent",
    data: { msg },
  });
});

export const deleteMsg = asyncHandler(async (req, res, next) => {
  const { msgId } = req.params;
  const msg = await MsgModel.findByIdAndDelete(msgId);

  if (!msg) {
    return next(new Error("In-Valid message", { cause: 404 }));
  }

  return successHandler({ res, status: 204 });
});
