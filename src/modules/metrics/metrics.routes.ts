import { Router } from "express";
import { USER_ROLE } from "../../constant";
import { auth } from "../../middlewares";
import { metricsController } from "./metrics.controller";
const router: Router = Router();

router.get("/dashboard", auth(USER_ROLE.ADMIN), metricsController.dashboard);

export default router;
