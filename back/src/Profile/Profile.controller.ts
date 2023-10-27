import express, {Request, Response, NextFunction} from "express";
import profileService from "./Profile.service";
import HttpError from "../Utils/HttpError";
import photoService from "./Photo.service";
import {validateMIMEType} from "validate-image-type";
import fs from "fs/promises";
import path from "path";
import jwtStrategy from "../Auth/jwt.strategy";
import photoStorage from "../Utils/photoStorage";
import asyncWrapper from "../Utils/asyncWrapper";
import ParseParamId from "../Utils/validations/parseIdParam";
import {MyRequest} from "../Types/request";
import {body, param} from "express-validator";
import CheckValidation from "../Utils/validations/checkValidationResult";

class ProfileController {
  public path = "/profile";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getAll);
    this.router.get(
      this.path + "/:id",
      jwtStrategy,
      param("id").isInt(),
      CheckValidation,
      asyncWrapper(this.getById)
    );
    this.router.post(
      this.path + "/upload",
      jwtStrategy,
      photoStorage.single("photo"),
      asyncWrapper(this.upload)
    );
    this.router.get(
      this.path + "/:id/photo",
      jwtStrategy,
      param("id").isInt(),
      CheckValidation,
      this.sendPhoto
    );
    this.router.post(
      this.path + "/like",
      jwtStrategy,
      body("id").isInt(),
      CheckValidation,
      this.like
    );
  }

  getById = async (req: MyRequest, res: Response) => {
    console.log("param", req.params);
    const user = await profileService.get_by_id(req.params.id!);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      console.log("user found", user);
      res.send(user);
    }
  };

  getAll = async (req: MyRequest, res: Response) => {
    const user = await profileService.get_all(req.user_id || 1);
    res.send(user);
  };

  upload = async (req: MyRequest, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log("file", file);

    if (!file) {
      throw new HttpError(400, "Please upload a file");
    }
    const result = await validateMIMEType(file.path, {
      originalFilename: file.originalname,
      allowMimeTypes: ["image/jpeg", "image/png"],
    });
    if (!result.ok) {
      await fs.unlink(file.path);
      throw new HttpError(400, "Invalid file type");
    }
    await photoService.insert(req.user_id!, file);
    console.log("result: ", result);
    res.send(file);
  };

  sendPhoto = async (req: MyRequest, res: Response) => {
    // if (req.id_parsed) {
    const photo = await photoService.getByProfileId(req.params.id!);
    if (!photo) {
      return res.send(undefined);
    }
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${photo.filename}`
    );
    const dirname = path.resolve() + "/";
    res.sendFile(dirname + photo.path);
    res.send({
      status: "success",
      message: "File sent successfully",
    });
    // }
  };

  like = async (req: MyRequest, res: Response) => {
    const like = await profileService.like(req.user_id!, req.body.id);
    res.send(like);
  };
}

export default ProfileController;
