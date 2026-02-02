const File = require("../models/File_model");

const uploadFile = async (req, res) => {
  try {
    console.log("REQ.FILE =", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    const file = new File({
      originalName: req.file.originalname,
      s3Key: req.file.key,
      s3Url: req.file.location,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    await file.save();

    return res.status(201).json({
      message: "File uploaded successfully",
      file
    });
  } catch (error) {
    console.error("UPLOAD ERROR =", error);
    return res.status(500).json({
      message: "Upload failed",
      error: error.message
    });
  }
};

module.exports = { uploadFile };
