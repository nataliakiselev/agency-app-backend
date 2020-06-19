import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, process.env.UPLOAD_PATH || "uploads/");
  },
  filename: function (req, file, callback) {
    const parts = file.originalname.split(".");
    const extension = parts.pop();
    const filePathAndName = parts.join("");
    callback(null, `${filePathAndName}-${Date.now()}.${extension}`);
  },
});

export default multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });
