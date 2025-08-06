import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersMongoService } from '../users/users-mongo.service';
import { ClientsMongoService } from '../clients/clients-mongo.service';
import { InvoicesMongoService } from '../invoices/invoices-mongo.service';
import { CreateUserMongoDto } from '../users/dto/create-user-mongo.dto';
import { CreateClientMongoDto } from '../clients/dto/create-client-mongo.dto';
import { CreateInvoiceMongoDto } from '../invoices/dto/create-invoice-mongo.dto';

@Controller('test')
export class TestMongoController {
  constructor(
    private readonly usersService: UsersMongoService,
    private readonly clientsService: ClientsMongoService,
    private readonly invoicesService: InvoicesMongoService,
  ) {}

  // Tests pour les utilisateurs
  @Get('users')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserMongoDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('users/search/:query')
  async searchUsers(@Param('query') query: string) {
    return this.usersService.search(query);
  }

  @Get('users/count/total')
  async countUsers() {
    const total = await this.usersService.count();
    const active = await this.usersService.countActive();
    return { total, active };
  }

  // Tests pour les clients
  @Get('clients/user/:userId')
  async getClientsByUser(@Param('userId') userId: string) {
    return this.clientsService.findByUserId(userId);
  }

  @Get('clients/:id')
  async getClientById(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Post('clients/:userId')
  async createClient(
    @Param('userId') userId: string,
    @Body() createClientDto: CreateClientMongoDto,
  ) {
    return this.clientsService.create(userId, createClientDto);
  }

  @Get('clients/search/:userId/:query')
  async searchClients(
    @Param('userId') userId: string,
    @Param('query') query: string,
  ) {
    return this.clientsService.search(userId, query);
  }

  @Get('clients/count/:userId')
  async countClientsByUser(@Param('userId') userId: string) {
    return this.clientsService.countByUserId(userId);
  }

  // Tests pour les factures
  @Get('invoices/user/:userId')
  async getInvoicesByUser(@Param('userId') userId: string) {
    return this.invoicesService.findByUserId(userId);
  }

  @Get('invoices/:id')
  async getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.findById(id);
  }

  @Post('invoices/:userId')
  async createInvoice(
    @Param('userId') userId: string,
    @Body() createInvoiceDto: CreateInvoiceMongoDto,
  ) {
    const invoiceData = {
      clientId: createInvoiceDto.clientId,
      title: createInvoiceDto.title,
      description: createInvoiceDto.description,
      amount: createInvoiceDto.amount,
      taxAmount: createInvoiceDto.taxAmount,
      totalAmount: createInvoiceDto.totalAmount,
      dueDate: new Date(createInvoiceDto.dueDate),
      items: createInvoiceDto.items,
      notes: createInvoiceDto.notes,
    };

    return this.invoicesService.create(userId, invoiceData);
  }

  @Get('invoices/search/:userId/:query')
  async searchInvoices(
    @Param('userId') userId: string,
    @Param('query') query: string,
  ) {
    return this.invoicesService.search(userId, query);
  }

  @Get('invoices/status/:userId/:status')
  async getInvoicesByStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ) {
    return this.invoicesService.findByStatus(userId, status);
  }

  @Get('invoices/stats/:userId')
  async getInvoiceStats(@Param('userId') userId: string) {
    return this.invoicesService.getStats(userId);
  }

  @Put('invoices/:id/:userId/status')
  async updateInvoiceStatus(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('status') status: string,
  ) {
    return this.invoicesService.updateStatus(id, userId, status);
  }

  // Test global de santé
  @Get('health')
  async healthCheck() {
    const userCount = await this.usersService.count();
    const clientCount = await this.clientsService.count();
    const invoiceCount = await this.invoicesService.count();

    return {
      status: 'healthy',
      database: 'MongoDB',
      timestamp: new Date().toISOString(),
      counts: {
        users: userCount,
        clients: clientCount,
        invoices: invoiceCount,
      },
    };
  }
}
