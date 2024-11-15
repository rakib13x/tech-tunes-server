import { Router } from "express";
import { paymentController } from "./payment.controller";

const paymentRouter: Router = Router();

// check the payment confirmation
paymentRouter.post("/confirmation", paymentController.paymentConfirmation);
// payment failed
paymentRouter.post("/failed", paymentController.paymentFailed);

// payment cancelled
paymentRouter.get("/canceled", paymentController.paymentCancelled);
// get payments info by transaction id
paymentRouter.get("/:transactionId", paymentController.getPaymentInfo);

export default paymentRouter;
