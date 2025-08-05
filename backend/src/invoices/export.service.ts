import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportService {
  // Génération d'un template HTML pour la facture
  private generateInvoiceHTML(invoice: any): string {
    const { user, client, items } = invoice;

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid ${user.primaryColor || '#8b5cf6'};
            padding-bottom: 20px;
        }
        .vendor-info {
            flex: 1;
        }
        .invoice-title {
            flex: 1;
            text-align: right;
        }
        .invoice-title h1 {
            color: ${user.primaryColor || '#8b5cf6'};
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
        }
        .invoice-number {
            font-size: 1.2em;
            color: #666;
            margin-top: 10px;
        }
        .company-name {
            font-size: 1.5em;
            font-weight: bold;
            color: ${user.primaryColor || '#8b5cf6'};
            margin-bottom: 10px;
        }
        .address-block {
            margin-bottom: 30px;
        }
        .address-block h3 {
            color: ${user.primaryColor || '#8b5cf6'};
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .billing-section > div {
            flex: 1;
            margin-right: 20px;
        }
        .billing-section > div:last-child {
            margin-right: 0;
        }
        .invoice-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .invoice-details table {
            width: 100%;
        }
        .invoice-details td {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .invoice-details td:first-child {
            font-weight: bold;
            width: 150px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: ${user.primaryColor || '#8b5cf6'};
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: bold;
        }
        .items-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-left: auto;
            width: 300px;
            margin-top: 20px;
        }
        .totals table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals td {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
        }
        .totals .total-row {
            background: ${user.primaryColor || '#8b5cf6'};
            color: white;
            font-weight: bold;
            font-size: 1.2em;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .payment-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .payment-info h3 {
            color: #1976d2;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- En-tête -->
        <div class="header">
            <div class="vendor-info">
                <div class="company-name">${user.company || user.name}</div>
                <div>${user.companyAddress || ''}</div>
                <div>${user.companyPostalCode || ''} ${user.companyCity || ''}</div>
                <div>${user.companyCountry || 'France'}</div>
                ${user.phone ? `<div>Tél: ${user.phone}</div>` : ''}
                ${user.email ? `<div>Email: ${user.email}</div>` : ''}
                ${user.companySiret ? `<div>SIRET: ${user.companySiret}</div>` : ''}
                ${user.companyVatNumber ? `<div>TVA: ${user.companyVatNumber}</div>` : ''}
            </div>
            <div class="invoice-title">
                <h1>FACTURE</h1>
                <div class="invoice-number">N° ${invoice.invoiceNumber}</div>
            </div>
        </div>

        <!-- Informations de facturation -->
        <div class="billing-section">
            <div class="address-block">
                <h3>Facturé à :</h3>
                <div><strong>${client.name}</strong></div>
                <div>${client.address || ''}</div>
                <div>${client.postalCode || ''} ${client.city || ''}</div>
                <div>${client.country || 'France'}</div>
                ${client.email ? `<div>Email: ${client.email}</div>` : ''}
                ${client.phone ? `<div>Tél: ${client.phone}</div>` : ''}
                ${client.siret ? `<div>SIRET: ${client.siret}</div>` : ''}
            </div>
            
            <div class="invoice-details">
                <table>
                    <tr>
                        <td>Date d'émission:</td>
                        <td>${new Date(invoice.issueDate).toLocaleDateString('fr-FR')}</td>
                    </tr>
                    <tr>
                        <td>Date d'échéance:</td>
                        <td>${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</td>
                    </tr>
                    <tr>
                        <td>Statut:</td>
                        <td><strong>${this.getStatusLabel(invoice.status)}</strong></td>
                    </tr>
                    ${
                      invoice.paidDate
                        ? `
                    <tr>
                        <td>Date de paiement:</td>
                        <td>${new Date(invoice.paidDate).toLocaleDateString('fr-FR')}</td>
                    </tr>
                    `
                        : ''
                    }
                </table>
            </div>
        </div>

        <!-- Tableau des articles -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Quantité</th>
                    <th class="text-right">Prix unitaire</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${
                  items && items.length > 0
                    ? items
                        .map(
                          (item: any) => `
                <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${item.unitPrice.toFixed(2)} €</td>
                    <td class="text-right">${item.totalPrice.toFixed(2)} €</td>
                </tr>
                `,
                        )
                        .join('')
                    : `
                <tr>
                    <td colspan="4" style="text-align: center; color: #666;">Aucun article</td>
                </tr>
                `
                }
            </tbody>
        </table>

        <!-- Totaux -->
        <div class="totals">
            <table>
                <tr>
                    <td>Sous-total HT:</td>
                    <td class="text-right">${invoice.amount.toFixed(2)} €</td>
                </tr>
                <tr>
                    <td>TVA:</td>
                    <td class="text-right">${invoice.taxAmount.toFixed(2)} €</td>
                </tr>
                <tr class="total-row">
                    <td>Total TTC:</td>
                    <td class="text-right">${invoice.totalAmount.toFixed(2)} €</td>
                </tr>
            </table>
        </div>

        <!-- Informations de paiement -->
        ${
          user.bankIban
            ? `
        <div class="payment-info">
            <h3>Informations de paiement</h3>
            <div><strong>Banque:</strong> ${user.bankName || 'Non spécifiée'}</div>
            <div><strong>IBAN:</strong> ${user.bankIban}</div>
            ${user.bankBic ? `<div><strong>BIC:</strong> ${user.bankBic}</div>` : ''}
        </div>
        `
            : ''
        }

        <!-- Notes -->
        ${
          invoice.notes
            ? `
        <div style="margin-top: 30px;">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
        </div>
        `
            : ''
        }

        <!-- Pied de page -->
        <div class="footer">
            <p>Merci pour votre confiance !</p>
            ${user.website ? `<p>Site web: ${user.website}</p>` : ''}
        </div>
    </div>
</body>
</html>
    `;
  }

  private getStatusLabel(status: string): string {
    const statusLabels = {
      DRAFT: 'Brouillon',
      SENT: 'Envoyée',
      PAID: 'Payée',
      OVERDUE: 'En retard',
      CANCELLED: 'Annulée',
    };
    return statusLabels[status] || status;
  }

  // Export PDF d'une facture
  async exportInvoiceToPDF(invoice: any): Promise<Uint8Array> {
    try {
      // Import dynamique de puppeteer
      const puppeteer = await import('puppeteer');

      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });

      const page = await browser.newPage();
      const html = this.generateInvoiceHTML(invoice);

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      await browser.close();
      return pdf;
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      throw new Error('Impossible de générer le PDF');
    }
  }

  // Export CSV des factures
  async exportInvoicesToCSV(invoices: any[]): Promise<string> {
    try {
      // Import dynamique de csv-writer
      const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

      const csvStringifier = createCsvWriter({
        header: [
          { id: 'invoiceNumber', title: 'Numéro' },
          { id: 'clientName', title: 'Client' },
          { id: 'issueDate', title: 'Date émission' },
          { id: 'dueDate', title: 'Date échéance' },
          { id: 'amount', title: 'Montant HT' },
          { id: 'taxAmount', title: 'TVA' },
          { id: 'totalAmount', title: 'Total TTC' },
          { id: 'status', title: 'Statut' },
          { id: 'paidDate', title: 'Date paiement' },
        ],
      });

      const records = invoices.map((invoice) => ({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client?.name || 'N/A',
        issueDate: new Date(invoice.issueDate).toLocaleDateString('fr-FR'),
        dueDate: new Date(invoice.dueDate).toLocaleDateString('fr-FR'),
        amount: invoice.amount.toFixed(2),
        taxAmount: invoice.taxAmount.toFixed(2),
        totalAmount: invoice.totalAmount.toFixed(2),
        status: this.getStatusLabel(invoice.status),
        paidDate: invoice.paidDate
          ? new Date(invoice.paidDate).toLocaleDateString('fr-FR')
          : '',
      }));

      return (
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(records)
      );
    } catch (error) {
      console.error('Erreur lors de la génération CSV:', error);
      throw new Error('Impossible de générer le CSV');
    }
  }

  // Définir les en-têtes de réponse pour le téléchargement
  setDownloadHeaders(res: Response, filename: string, contentType: string) {
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
  }
}
