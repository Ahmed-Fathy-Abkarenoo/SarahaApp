import mongoose, { model, Schema } from "mongoose";
import { genderTypes, roleTypes } from "../../utils/constants/constants.js";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      minLength: [2, "user name must be 2 character or more"],
      maxLength: 50,
      trim: true,
      required: [true, "user name is require"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    DOB: Date,
    address: String,
    phone: String,
    image: String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    changePasswordTime: Date,
    OTP: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.users || model("users", userSchema);
export default userModel;
