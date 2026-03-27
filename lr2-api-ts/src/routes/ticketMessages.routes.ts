import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateMessage } from "../validators/ticketMessages.validator.js";
import * as controller from "../controllers/ticketMessages.controller.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate(validateCreateMessage), controller.create);
router.delete("/:id", controller.remove);

export default router;
