const express = require("express");
const router = express.Router();
const File = require("../models/File_model");
const upload = require("../middleware/upload");
const { uploadFile } = require("../controllers/file_controller");
const {
  requestDownload,
  verifyAndDownload
} = require("../controllers/download_controller");


router.post(
  "/upload",
  upload.single("file"), 
  uploadFile
);

router.get("/", async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});

router.post("/request-download/:fileId", requestDownload);
router.post("/verify-download", verifyAndDownload);

module.exports = router;
