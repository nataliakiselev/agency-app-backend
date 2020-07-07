import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, process.env.UPLOAD_PATH || "uploads/");
    },
    filename: function (req, file, callback) {
      // const parts = file.originalname.split(".");
      // const extension = parts.pop();
      // const filePathAndName = parts.join("");
      // callback(null, `${filePathAndName}-${Date.now()}.${extension}`);
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid file extension!");
    cb(error, isValid);
  },
});

export default upload;
