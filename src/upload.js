import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

const { AWS_ID, AWS_KEY, BUCKET_NAME, AWS_ENABLED } = process.env;

// AWS.config.loadFromPath("./config.json");

AWS.config.update({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_KEY,
  region: "eu-west-2",
});

const s3 = new AWS.S3({
  params: {
    Bucket: BUCKET_NAME,
  },
});

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileName = function (req, file, callback) {
  // const parts = file.originalname.split(".");
  // const extension = parts.pop();
  // const filePathAndName = parts.join("");
  // callback(null, `${filePathAndName}-${Date.now()}.${extension}`);
  const ext = MIME_TYPE_MAP[file.mimetype];
  callback(null, uuidv4() + "." + ext);
};

const awsStorage = multerS3({
  s3: s3,
  bucket: BUCKET_NAME,
  acl: "public-read-write",
  key: fileName,
});

const localStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, process.env.UPLOAD_PATH || "uploads/");
  },
  filename: fileName,
});

const upload = multer({
  storage: AWS_ENABLED ? awsStorage : localStorage,
  // storage: productionStorage,
  limits: {
    files: 5,
    fileSize: 2 * 2000 * 2000,
  },
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid file extension!");
    cb(error, isValid);
  },
});

export default upload;
