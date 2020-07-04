import multer from "multer";

// const MIME_TYPE_MAP = {
//   'image/png' : 'png',
//   'image/jpeg' : 'jpeg',
//   'image/jpg': 'jpg'
// }
const upload = multer({
  limits: { fileSize: 1024 * 1024 * 5 },
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, process.env.UPLOAD_PATH || "uploads/");
    },
    filename: function (req, file, callback) {
      // const parts = file.originalname.split(".");
      // const extension = parts.pop();
      // const filePathAndName = parts.join("");
      // callback(null, `${filePathAndName}-${Date.now()}.${extension}`);
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, Date.now() + "." + ext); //or uuid()
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid file extension!");
    cb(error, isValid);
  },
});

export default upload;
