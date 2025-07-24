import express from "express";
import {
  createFlowchart,
  getDataById,
  getFlowchartData,
  updateFlowchart,
} from "../controllers/flowchartController.js";

const router = express.Router();

router.post("/save", createFlowchart);
router.get("/", getFlowchartData);
router.get("/:id", getDataById);
router.put("/update/:id", updateFlowchart);

export default router;
