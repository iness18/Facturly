// @ts-ignore
import PDFDocument from "pdfkit";

export const createInvoicePdf = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.fontSize(20).text("Facture", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Freelance: ${data.freelancer}`);
      doc.text(`Client: ${data.client}`);
      doc.text(`TVA: ${data.tva}%`);
      doc.moveDown();

      doc.text("Détails des prestations :");
      data.lineItems.forEach((item: any, index: number) => {
        doc.text(
          `${index + 1}. ${item.description} - ${item.quantity} x ${
            item.unitPrice
          }€`
        );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: ${data.total}€`, { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
