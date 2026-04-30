import { Router } from "express";

import {
  getAllMessages,
  getMessageById,
  createMessage,
  deleteMessage,
} from "../controllers/ticketMessages.controller.js";

const router = Router();

router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);

export default router;
