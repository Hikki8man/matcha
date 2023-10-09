const express = require("express");
const profileRoute = express.Router();
const profileRepo = require("./profile");
const jwtStrategy = require("../Auth/jwt.strategy");
const photoStorage = require("../Utils/photoStorage");
const path = require("path");
const {validateMIMEType} = require("validate-image-type");
const HttpError = require("../Utils/errors");
const asyncWrapper = require("../Utils/asyncWrapper");
const fs = require("fs/promises");
const photoRepo = require("./photo");
const queryBuilder = require("../Utils/queryBuilder");

function validateIdParam(req, res, next) {
  const id = req.params.id;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId.toString() !== id) {
    // If the parsed result is NaN or the parsed result doesn't match the original string,
    // it's not a valid integer.
    return res.status(400).send("Invalid ID parameter. Must be an integer.");
  }
  req.params.id = parsedId;
  next();
}

profileRoute.get(
  "/profile/:id",
  validateIdParam,
  //   jwtStrategy,
  async (req, res) => {
    const user = await profileRepo.get_by_id(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      console.log("user found", user);
      res.send(user);
    }
  }
);

profileRoute.get("/profile", jwtStrategy, async (req, res) => {
  const user = await profileRepo.get_all(req.user.id);
  res.send(user);
});

profileRoute.post(
  "/profile/upload",
  jwtStrategy,
  photoStorage.single("photo"),
  asyncWrapper(async (req, res, next) => {
    const file = req.file;
    console.log("file", file);

    if (!file) {
      throw new HttpError(400, "Please upload a file");
    }
    const result = await validateMIMEType(file.path, {
      originalFilename: file.originalFilename,
      allowMimeTypes: ["image/jpeg", "image/png"],
    });
    if (!result.ok) {
      await fs.unlink(file.path);
      throw new HttpError(400, "Invalid file type");
    }
    await photoRepo.insert(req.user.id, file);
    console.log("result: ", result);
    res.send(file);
  })
);

profileRoute.get("/profile/:id/photo", jwtStrategy, async (req, res) => {
  const photo = await photoRepo.getByProfileId(req.params.id);
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
});

module.exports = profileRoute;
