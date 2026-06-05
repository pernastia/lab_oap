import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import usersRoutes from "./routes/users.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import statusesRoutes from "./routes/statuses.routes.js";
import ticketMessagesRoutes from "./routes/ticketMessages.routes.js";

import logger from "./middleware/request-logging.middleware.js";
import errorHandler from "./middleware/error-handler.middleware.js";

import { initDb } from "./db/initDb.js";
import { getUserById } from "./repositories/users.repository.js";
import { getTop3TicketsWithTopUser } from "./services/tickets.service.js";

const app = express();

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Demo-UserId");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(logger);

export async function demoAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const rawId = req.headers["x-demo-userid"];

  if (!rawId) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing X-Demo-UserId header" },
    });
  }

  const userId = Number(rawId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid X-Demo-UserId" },
    });
  }

  const user = await getUserById(userId);
  if (!user) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "User not found" },
    });
  }

  (req as any).currentUserId = userId;
  next();
}

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/tickets", ticketsRoutes);
app.use("/api/v1/statuses", statusesRoutes);
app.use("/api/v1/messages", ticketMessagesRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.get(
  "/api/v1/stats/top-tickets",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getTop3TicketsWithTopUser();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },
);

app.use(errorHandler);
initDb();
app.listen(3000, () => console.log("API started on http://localhost:3000"));
