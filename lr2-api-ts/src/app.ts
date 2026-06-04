import express from "express";
import cors from "cors";
import ticketsRoutes from "./routes/tickets.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorHandler from "./middleware/error-handler.middleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5501",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Cache-Control"],
  }),
);
app.use("/api/v1/tickets", ticketsRoutes);
app.use("/api/v1/users", usersRoutes);

app.use(errorHandler);
export default app;
