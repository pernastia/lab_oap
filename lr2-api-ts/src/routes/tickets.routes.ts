import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateTicket } from "../validators/tickets.validator.js";
import * as controller from "../controllers/tickets.controller.js";
import validateTicket from "../middleware/validate-ticket.middleware.js";

const router = Router();

router.get("/", controller.getAllTickets);
router.get("/:id", controller.getTicketById);

router.post("/", validate(validateCreateTicket), controller.createTicket);
router.put("/:id", validateTicket, controller.updateTicket);

router.delete("/:id", controller.deleteTicket);

export default router;
