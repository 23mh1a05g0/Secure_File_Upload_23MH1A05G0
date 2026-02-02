const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },
    s3Key: {
      type: String,
      required: true
    },
    s3Url: {
      type: String,
      required: true
    },
    fileType: String,
    fileSize: Number
  },
  { timestamps: true }
);

module.exports = new mongoose.model("File", fileSchema);
