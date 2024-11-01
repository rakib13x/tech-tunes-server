import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import commentRoutes from "../modules/comment/comment.routes";
import postRoutes from "../modules/post/post.routes";
import userRoutes from "../modules/user/user.route";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/users",
    routes: userRoutes,
  },
  {
    path: "/posts",
    routes: postRoutes,
  },
  {
    path: "/comments",
    routes: commentRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
