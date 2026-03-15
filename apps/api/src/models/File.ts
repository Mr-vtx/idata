import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },

  messageId: { type: Number, required: true },
  accessHash: { type: String, default: null },
  fileReference: { type: String, default: null },
  dcId: { type: Number, default: null },

  sha256: { type: String, default: null, index: true },

  parts: [
    {
      messageId: { type: Number },
      accessHash: { type: String },
      fileReference: { type: String },
      dcId: { type: Number },
      size: { type: Number },
    },
  ],
  isMultiPart: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

fileSchema.index({ sha256: 1, userId: 1 });
fileSchema.index({ userId: 1, createdAt: -1 });

export const File = mongoose.model("File", fileSchema);
