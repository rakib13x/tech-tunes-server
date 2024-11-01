import "colors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

// local imports
import applicationRoutes from "./routes";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.0.116:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);
app.use(express.json());
app.use(cookieParser());
// console.log(process.env.DATABASE_URL);

// application routes
app.use(applicationRoutes);

export default app;
