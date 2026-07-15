const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    console.log("Received file:", file ? file.originalname : "No file");

    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Convert buffer → base64
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    console.log("Base64 string length:", base64.length);    

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "food-app",
    });

    console.log("Cloudinary upload result:", result);
    res.json({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
  console.log("UPLOAD ERROR 👉", err);
  res.status(500).json({ message: err.message || "Upload failed" });
}
});

module.exports = router;