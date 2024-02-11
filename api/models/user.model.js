import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
