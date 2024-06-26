import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { MyRequest } from '../../../types/request';

const storage = multer.diskStorage({
  destination: (req: MyRequest, _file, cb) => {
    const userId = req.user_id!;
    const dest = `./uploads/${userId}`;
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage: storage, fileFilter: fileFilter });
