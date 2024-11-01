import { Router } from "express";
import { USER_ROLE } from "../../constant";
import { auth } from "../../middlewares";
import { userController } from "./user.controller";

const userRouter: Router = Router();

// get all users (admin only)
userRouter.get("/", auth(USER_ROLE.ADMIN), userController.getAllUsers);

export default userRouter;
