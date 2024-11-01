import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
