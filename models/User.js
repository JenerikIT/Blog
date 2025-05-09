import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatarUrl: String,

    passwordHash: {
      type: String,
      required: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", UserSchema);
