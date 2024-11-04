import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { USER_ROLE } from "../../constant";
import { validateRequest } from "../../middlewares";
import { postController } from "./post.controller";
import { postValidationSchema } from "./post.validation";

const postRouter: Router = Router();

postRouter.post(
  "/create",
  authMiddleware(USER_ROLE.USER, USER_ROLE.ADMIN),
  multerUpload.single("image"),
  (req: Request, _res: Response, next: NextFunction) => {
    if (req.file?.path) {
      req.body.data = JSON.stringify({
        ...JSON.parse(req.body.data),
        coverImage: req.file.path,
      });
    }
    req.body = { ...JSON.parse(req.body.data) };
    next();
  },
  validateRequest(postValidationSchema.create),
  postController.createPost,
);

postRouter.get("/list", postController.getPosts);

export default postRouter;
function authMiddleware(
  USER: any,
  ADMIN: any,
): import("express-serve-static-core").RequestHandler<
  import("express-serve-static-core").ParamsDictionary,
  any,
  any,
  import("qs").ParsedQs,
  Record<string, any>
> {
  throw new Error("Function not implemented.");
}
