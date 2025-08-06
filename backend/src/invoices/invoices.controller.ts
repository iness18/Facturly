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
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { InvoicesMongoService } from './invoices-mongo.service';
import { ExportService } from './export.service';
import { CreateInvoiceMongoDto } from './dto/create-invoice-mongo.dto';
import { CreateInvoiceWithClientDto } from './dto/create-invoice-with-client.dto';
import { UpdateInvoiceMongoDto } from './dto/update-invoice-mongo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesMongoService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInvoiceDto: CreateInvoiceMongoDto, @Request() req) {
    // Forcer l'userId depuis le token JWT et convertir la date
    const invoiceData = {
      ...createInvoiceDto,
      dueDate: new Date(createInvoiceDto.dueDate),
    };
    return this.invoicesService.create(req.user.userId, invoiceData);
  }

  @Post('with-client')
  @HttpCode(HttpStatus.CREATED)
  createWithClient(
    @Body() createInvoiceDto: CreateInvoiceWithClientDto,
    @Request() req,
  ) {
    // Forcer l'userId depuis le token JWT et convertir la date
    const invoiceData = {
      ...createInvoiceDto,
      dueDate: new Date(createInvoiceDto.dueDate),
    };
    return this.invoicesService.createWithClientInfo(
      req.user.userId,
      invoiceData,
    );
  }

  @Get()
  findAll(@Request() req) {
    // Filtrer par utilisateur connecté
    return this.invoicesService.findByUserId(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    // Statistiques pour l'utilisateur connecté uniquement
    return this.invoicesService.getStats(req.user.userId);
  }

  // Export de toutes les factures en CSV (AVANT les routes avec :id)
  @Get('export/csv')
  async exportInvoicesCSV(@Res() res: Response, @Request() req) {
    try {
      // Export uniquement pour l'utilisateur connecté
      const invoices = await this.invoicesService.findByUserId(req.user.userId);
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
  findOne(@Param('id') id: string, @Request() req) {
    // Vérifier que la facture appartient à l'utilisateur
    return this.invoicesService.findByIdAndUserId(id, req.user.userId);
  }

  // Export d'une facture en PDF
  @Get(':id/export/pdf')
  async exportInvoicePDF(@Param('id') id: string, @Res() res: Response) {
    try {
      const invoice = await this.invoicesService.findById(id);
      if (!invoice) {
        return res.status(404).json({ message: 'Facture non trouvée' });
      }

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
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceMongoDto,
    @Request() req,
  ) {
    // Vérifier que la facture appartient à l'utilisateur et convertir les dates
    const updateData: any = { ...updateInvoiceDto };
    if (updateInvoiceDto.dueDate) {
      updateData.dueDate = new Date(updateInvoiceDto.dueDate);
    }
    if (updateInvoiceDto.paidDate) {
      updateData.paidDate = new Date(updateInvoiceDto.paidDate);
    }
    return this.invoicesService.update(id, req.user.userId, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req) {
    // Vérifier que la facture appartient à l'utilisateur
    return this.invoicesService.delete(id, req.user.userId);
  }
}
