import express from "express";
import {
  downloadReportController,
  generateLinkController,
  getReports,
} from "../controllers/report.controller";

const router = express.Router();

router.get("/:email", getReports);
router.get("/download/:token", downloadReportController);

router.post("/generate-download-link", generateLinkController);

export default router;
