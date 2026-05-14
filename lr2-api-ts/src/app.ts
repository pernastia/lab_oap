import express from "express";
import cors from "cors";
import ticketsRoutes from "./routes/tickets.routes.js";
import errorHandler from "./middleware/error-handler.middleware.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use("/api/v1/tickets", ticketsRoutes);
app.use(errorHandler);
export default app;
