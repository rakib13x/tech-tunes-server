import { Router } from "express";
import { paymentController } from "./payment.controller";

const paymentRouter: Router = Router();

// check the payment confirmation
paymentRouter.post("/confirmation", paymentController.paymentConfirmation);

export default paymentRouter;
