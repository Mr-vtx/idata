import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storageLimit: { type: Number, default: 25 * 1024 * 1024 * 1024 }, 
  usedStorage: { type: Number, default: 0 },
  plan: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },

  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 14);
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
