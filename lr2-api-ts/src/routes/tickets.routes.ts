import { Router } from "express";
import { demoAuth } from "../index.js";

import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTopTicketsWithTopUser,
} from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getAllTickets);
router.get("/top-users", getTopTicketsWithTopUser);
router.get("/:id", demoAuth, getTicketById);
router.post("/", demoAuth, createTicket);
router.put("/:id", demoAuth, updateTicket);
router.delete("/:id", demoAuth, deleteTicket);

export default router;
