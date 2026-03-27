import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateStatus } from "../validators/statuses.validator.js";
import * as controller from "../controllers/statuses.controller.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validate(validateCreateStatus), controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
