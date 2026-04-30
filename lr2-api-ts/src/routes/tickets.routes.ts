import { Router } from "express";

import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getAllTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
