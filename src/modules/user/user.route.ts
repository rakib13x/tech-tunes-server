import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { USER_ROLE } from "../../constant";
import { auth, validateRequest } from "../../middlewares";
import { catchAsync } from "../../utils";
import { userController } from "./user.controller";
import { userValidationSchema } from "./user.validation";

const userRouter: Router = Router();

// get all users (admin only)
userRouter.get("/", auth(USER_ROLE.ADMIN), userController.getAllUsers);

// get user details by username
userRouter.get("/:username", userController.getSingleUserByUsername);

// update logged in user profile endpoints
userRouter.patch(
  "/update-profile",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
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
  validateRequest(userValidationSchema.updateProfile),
  userController.updateProfile,
);
export default userRouter;
