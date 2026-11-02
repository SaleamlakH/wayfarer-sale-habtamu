import express, { type Express, type Request, type Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") ?? [],
    credentials: false,
  }),
);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.send("Hello");
});

export default app;
