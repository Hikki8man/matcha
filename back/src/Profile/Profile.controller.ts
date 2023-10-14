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
import {body} from "express-validator";
import hasFailedValidation from "../Utils/validations/checkValidationResult";

class ProfileController {
  public path = "/profile";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path + "/:id",
      jwtStrategy,
      ParseParamId,
      asyncWrapper(this.getById)
    );
    this.router.get(this.path, jwtStrategy, this.getAll);
    this.router.post(
      this.path + "/upload",
      jwtStrategy,
      photoStorage.single("photo"),
      asyncWrapper(this.upload)
    );
    this.router.get(
      this.path + "/:id/photo",
      jwtStrategy,
      ParseParamId, //TODO change
      this.sendPhoto
    );
    this.router.post(
      this.path + "/like",
      jwtStrategy,
      body("id").isNumeric(),
      this.like
    );
  }

  getById = async (req: MyRequest, res: Response) => {
    //TODO test throw
    if (!req.id_parsed) {
      throw new HttpError(400, "Param id undefined");
    }
    const user = await profileService.get_by_id(req.id_parsed);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      console.log("user found", user);
      res.send(user);
    }
  };

  getAll = async (req: MyRequest, res: Response) => {
    const user = await profileService.get_all(req.user_id!);
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
    if (req.id_parsed) {
      const photo = await photoService.getByProfileId(req.id_parsed);
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
    }
  };

  like = async (req: MyRequest, res: Response) => {
    console.log("allo");
    if (hasFailedValidation(req, res)) {
      return;
    }
    const like = await profileService.like(req.user_id!, req.body.id);
    res.send(like);
  };
}

export default ProfileController;
