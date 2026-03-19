import { Router } from "express";
import * as controller from "../controllers/ticketMessages.controller.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.delete("/:id", controller.remove);

export default router;
