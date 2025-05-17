import mongoose, { model, Schema, Types } from "mongoose";

const msgSchema = new Schema({
  message: {
    type: String,
    require: true,
    trim: true,
    minLength: 2,
    maxLength: 5000,
  },
  recipientId: { type: Types.ObjectId, ref: "users" },
});

const MsgModel = mongoose.models.Msgs || model("msgs", msgSchema);

export default MsgModel;
