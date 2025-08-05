import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { ExportService } from './export.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.invoicesService.getStats();
  }

  // Export de toutes les factures en CSV (AVANT les routes avec :id)
  @Get('export/csv')
  async exportInvoicesCSV(
    @Res() res: Response,
    @Query('userId') userId?: string,
  ) {
    try {
      const invoices = await this.invoicesService.findAll(userId);
      const csv = await this.exportService.exportInvoicesToCSV(invoices);

      this.exportService.setDownloadHeaders(
        res,
        `factures-${new Date().toISOString().split('T')[0]}.csv`,
        'text/csv',
      );

      res.send(csv);
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'export CSV",
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  // Export d'une facture en PDF
  @Get(':id/export/pdf')
  async exportInvoicePDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const invoice = await this.invoicesService.findOne(id);
      const pdf = await this.exportService.exportInvoiceToPDF(invoice);

      this.exportService.setDownloadHeaders(
        res,
        `facture-${invoice.invoiceNumber}.pdf`,
        'application/pdf',
      );

      res.send(Buffer.from(pdf));
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'export PDF",
        error: error.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}
