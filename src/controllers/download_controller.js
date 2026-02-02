const File = require("../models/File_model");
const Otp = require("../models/Otp_model");
const transporter = require("../config/mail");
const crypto = require("crypto");
const AWS = require("aws-sdk");
const mongoose = require("mongoose");

const s3 = new AWS.S3();

/* =======================
   REQUEST DOWNLOAD (SEND OTP)
======================= */
const requestDownload = async (req, res) => {
  try {
    const { email } = req.body;
    const { fileId } = req.params;

    console.log("FILE ID RECEIVED =>", fileId); // 🔍 DEBUG LINE

    // ✅ VALIDATE ObjectId BEFORE QUERY
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        message: "Invalid fileId"
      });
    }

    const file = await File.findById(fileId);
    console.log(file);
    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.create({
      email,
      fileId,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "File Download OTP",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 5 minutes</p>`
    });

    return res.json({
      message: "OTP sent to email"
    });
  } catch (error) {
    console.error("REQUEST DOWNLOAD ERROR:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
};

/* =======================
   VERIFY OTP & DOWNLOAD
======================= */
const verifyAndDownload = async (req, res) => {
  try {
    const { email, otp, fileId } = req.body;

    console.log("VERIFY FILE ID =>", fileId); // 🔍 DEBUG

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        message: "Invalid fileId"
      });
    }

    const otpRecord = await Otp.findOne({
      email,
      fileId,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const downloadUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
      Expires: 60
    });

    return res.json({
      message: "OTP verified",
      downloadUrl
    });
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    return res.status(500).json({
      message: "Download failed",
      error: error.message
    });
  }
};

module.exports = { requestDownload, verifyAndDownload };
