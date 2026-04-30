import { Router } from "express";

import {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
} from "../controllers/statuses.controller.js";

const router = Router();

router.get("/", getAllStatuses);
router.get("/:id", getStatusById);
router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

export default router;
