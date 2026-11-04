import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.js";
import {
  bookingsRoute,
  categoriesRoute,
  placesRoute,
  usersRoute,
} from "./composition.js";

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

app.use("/api/users", usersRoute);
app.use("/api/places", placesRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/tour-slots", bookingsRoute);

app.use(errorHandler);

export default app;
