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
    phone: {
      type: String,
      required: true,
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", UserSchema);
