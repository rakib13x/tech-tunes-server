import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
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
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
