import { NextFunction, Request, Response, Router } from "express";

import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares";
import { catchAsync } from "../../utils";
import { authController } from "./auth.controller";
import { authValidationSchema } from "./auth.validation";

const authRoutes: Router = Router();

authRoutes.post(
  "/register",
  multerUpload.single("image"),
  catchAsync((req: Request, _res: Response, next: NextFunction) => {
    if (req.file?.path) {
      req.body.data = JSON.stringify({
        ...JSON.parse(req.body.data || "{}"),
        profilePicture: req.file.path,
      });
    }

    if (typeof req.body.data === "string" && req.body.data.trim()) {
      req.body = { ...JSON.parse(req.body.data) };
    } else {
      req.body = {};
    }

    next();
  }),
  validateRequest(authValidationSchema.register),
  authController.register,
);

authRoutes.post(
  "/login",
  validateRequest(authValidationSchema.login),
  authController.login,
);

export default authRoutes;
