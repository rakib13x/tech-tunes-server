import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { USER_ROLE } from "../../constant";
import { auth, validateRequest } from "../../middlewares";
import { postController } from "./post.controller";
import { postValidationSchema } from "./post.validation";

const postRouter: Router = Router();

postRouter.post(
  "/create",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
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

// vote on post
postRouter.put(
    "/:id/vote",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN),
    postController.voteOnPost,
  );
  
  // vote status
  postRouter.get(
    "/:id/vote-status",
    auth(USER_ROLE.USER),
    postController.getVoteStatus,
  );

export default postRouter;
