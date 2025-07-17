import { Request, Response } from "express";
import { createInvoicePdf } from "../utils/pdfGenerator";

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    const pdfBuffer = await createInvoicePdf(invoiceData);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice", error });
  }
};
