import multer, {FileFilterCallback} from "multer";
import {Request} from "express";
import path from "path";
import fs from "fs";
import {MyRequest} from "../Types/request";

const storage = multer.diskStorage({
  destination: (req: MyRequest, file, cb) => {
    console.log("req user", req.user);
    const userId = req.user ? req.user.id : 1;
    const dest = `./uploads/${userId}`;
    fs.mkdirSync(dest, {recursive: true});
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({storage: storage, fileFilter: fileFilter});
