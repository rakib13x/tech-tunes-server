import { Router } from "express";

const authRoutes: Router = Router();

authRoutes.get("/", (req, res) => {
  res.send("Auth route");
});

export default authRoutes;
