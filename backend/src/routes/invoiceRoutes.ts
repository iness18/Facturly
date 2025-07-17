import express from "express";
import { generateInvoice } from "../controllers/invoiceController";

const router = express.Router();

router.post("/generate", generateInvoice);

export default router;
