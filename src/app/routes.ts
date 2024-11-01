import { Request, Response, Router } from "express";
import mainRoutes from "../routes";
import { errorHandler } from "./errorHandler";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

router.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK✅");
});

// main routes
router.use("/api/v1", mainRoutes);

// error handler
router.use(errorHandler.notFound);
router.use(errorHandler.global);

export default router;
