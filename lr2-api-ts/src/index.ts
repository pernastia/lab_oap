import express, { type Request, type Response } from "express";

import usersRoutes from "./routes/users.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import statusesRoutes from "./routes/statuses.routes.js";
import ticketMessagesRoutes from "./routes/ticketMessages.routes.js";

import logger from "./middleware/request-logging.middleware.js";
import errorHandler from "./middleware/error-handler.middleware.js";

import { initDb } from "./db/initDb.js";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(logger);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/tickets", ticketsRoutes);
app.use("/api/v1/statuses", statusesRoutes);
app.use("/api/v1/messages", ticketMessagesRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});
app.use(errorHandler);
initDb();
app.listen(3000, () => console.log("API started on http://localhost:3000"));
