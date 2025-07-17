import { Request, Response } from "express";
import { createInvoicePdf } from "../utils/pdfGenerator";

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const pdfBuffer = await createInvoicePdf(req.body);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=facture.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erreur lors de la génération de la facture :", error);
    res.status(500).send("Erreur lors de la génération de la facture.");
  }
};
