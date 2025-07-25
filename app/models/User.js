import { Schema, model, models } from "mongoose";
import Property from "./Property";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Email is required"],
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
    },
    bookMarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
