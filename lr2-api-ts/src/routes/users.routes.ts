import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateUser } from "../validators/users.validator.js";
import * as controller from "../controllers/users.controller.js";

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.post("/", validate(validateCreateUser), controller.createUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
