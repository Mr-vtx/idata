import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  messageId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const File = mongoose.model("File", fileSchema);
