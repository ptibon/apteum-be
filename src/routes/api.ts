import express from "express";
import reportRouter from "./report.api";

const router = express();

router.use("/reports", reportRouter);

export default router;
